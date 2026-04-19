const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fetch = require('node-fetch');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5999;
const SECRET_KEY = process.env.JWT_SECRET || 'ethical_play_secret_123';
const ARK_API_KEY = '98b6a31b-2388-43af-ba4d-d0defc21b7cb';

app.use(express.json());
app.use(cors());

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// --- 火山引擎 Ark API 代理 ---

// 1. 获取文本生成 (支持流式转发 + 统计记录)
app.post('/api/ark/chat', async (req, res) => {
  const { messages, stream = true, user_id } = req.body;

  // 如果提供了 user_id，记录一次场景生成
  if (user_id) {
    db.run("INSERT INTO scenarios (user_id) VALUES (?)", [user_id]);
  }
  console.log('--- Ark Chat Request ---');
  console.log('Stream:', stream);

  try {
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'doubao-seed-2-0-mini-260215',
        messages,
        stream,
        reasoning_effort: 'minimal',
        max_reasoning_tokens: 1
      }),
      timeout: 120000 // 增加到 120 秒超时
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ark API Error:', response.status, errorText);
      return res.status(response.status).send(errorText);
    }

    if (stream) {
      console.log('Starting stream pipe...');
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      response.body.on('data', (chunk) => {
        const str = chunk.toString();
        console.log('Chunk from Ark (first 50 chars):', str.substring(0, 50));
      });

      response.body.pipe(res);
    } else {
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    console.error('Ark Chat Proxy Error:', error);
    res.status(500).json({ error: 'Failed to proxy Ark Chat' });
  }
});

// 2. 图像生成代理
app.post('/api/ark/images', async (req, res) => {
  const { prompt } = req.body;
  console.log('--- Ark Image Request ---');
  console.log('Prompt:', prompt);

  try {
    const response = await axios.post('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      model: 'doubao-seedream-5-0-260128', // 升级模型
      prompt,
      sequential_image_generation: "disabled",
      response_format: "url",
      size: "2048x2048",
      watermark: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ARK_API_KEY}`
      }
    });

    console.log('Image generated successfully');
    res.json(response.data);
  } catch (error) {
    console.error('Ark Image Proxy Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to proxy Ark Image', details: error.response?.data });
  }
});

// 3. 图像跨域代理 (解决 Canvas 跨域限制)
app.get('/api/ark/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) return res.status(400).send('URL is required');

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

    // 转发响应头
    res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');

    // 管道传输图片数据
    response.body.pipe(res);
  } catch (error) {
    console.error('Image Proxy Error:', error);
    res.status(500).send('Failed to proxy image');
  }
});

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ msg: 'Server is running' });
});

// 初始化数据库
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database');
    db.serialize(() => {
      // 1. 创建用户表 (包含 role 字段)
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'user'
      )`, (runErr) => {
        if (runErr) console.error('Error creating table', runErr);
        else console.log('Users table ready');
      });

      // 2. 创建场景记录表 (用于真实统计)
      db.run(`CREATE TABLE IF NOT EXISTS scenarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
        if (!err) console.log('Scenarios table ready');
      });

      // 3. 尝试为旧表增加 role 字段 (忽略重复列错误)
      db.run("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'", (err) => {
        // 3. 确保 admin 账号权限正确 (不论是否已存在)
        db.run("UPDATE users SET role = 'admin' WHERE username = 'admin'", (updErr) => {
          if (!updErr) console.log('Admin role verification complete');
        });

        // 4. 检查并创建默认 admin 账号
        db.get("SELECT * FROM users WHERE username = 'admin'", async (getErr, row) => {
          if (!row) {
            const adminPass = await bcrypt.hash('admin123', 10);
            db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", ['admin', adminPass, 'admin'], (insErr) => {
              if (insErr) console.error('Failed to create default admin:', insErr);
              else console.log('Default admin account created: admin / admin123');
            });
          }
        });
      });
    });
  }
});

// 中间件：验证管理员权限
const isAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.warn('[Server] isAdmin: No token provided');
    return res.status(401).json({ msg: '未登录' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('[Server] isAdmin: Token verify failed:', err.message);
      return res.status(401).json({ msg: '登录已过期' });
    }

    // 兼容逻辑：强制检查 admin 用户名
    const userRole = decoded.username === 'admin' ? 'admin' : (decoded.role || 'user');

    if (userRole !== 'admin') {
      console.warn(`[Server] isAdmin: Access denied for user ${decoded.username} with role ${userRole}`);
      return res.status(403).json({ msg: '权限不足，仅管理员可访问' });
    }

    req.user = { ...decoded, role: userRole };
    next();
  });
};

// --- 管理端接口 ---

// 1. 获取统计信息
app.get('/api/admin/stats', isAdmin, (req, res) => {
  console.log('[Server] Admin fetching stats...');
  const stats = {
    totalUsers: 0,
    todayScenarios: 0,
    totalScenarios: 0
  };

  db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
    if (row) stats.totalUsers = row.count;

    db.get("SELECT COUNT(*) as count FROM scenarios WHERE date(created_at) = date('now')", (err, row) => {
      if (row) stats.todayScenarios = row.count;

      db.get("SELECT COUNT(*) as count FROM scenarios", (err, row) => {
        if (row) stats.totalScenarios = row.count;
        res.json(stats);
      });
    });
  });
});

// 2. 获取用户列表
app.get('/api/admin/users', isAdmin, (req, res) => {
  console.log('[Server] Admin fetching user list...');
  db.all("SELECT id, username, role FROM users", (err, rows) => {
    if (err) {
      console.error('[Server] Fetch users error:', err);
      return res.status(500).json({ msg: '获取用户列表失败' });
    }
    res.json(rows || []);
  });
});

// 3. 删除用户
app.delete('/api/admin/users/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  console.log(`[Server] Admin deleting user ID: ${id}`);
  db.get("SELECT username FROM users WHERE id = ?", [id], (err, row) => {
    if (row && row.username === 'admin') {
      return res.status(400).json({ msg: '无法删除超级管理员' });
    }
    db.run("DELETE FROM users WHERE id = ?", [id], function(err) {
      if (err) return res.status(500).json({ msg: '删除失败' });
      res.json({ msg: '用户已删除' });
    });
  });
});

// 4. 更新用户信息 (例如重置密码、修改角色、修改用户名)
app.put('/api/admin/users/:id', isAdmin, async (req, res) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  console.log(`[Server] Admin updating user ID: ${id}`);

  db.get("SELECT username FROM users WHERE id = ?", [id], async (err, row) => {
    if (!row) return res.status(404).json({ msg: '用户不存在' });
    if (row.username === 'admin' && (role === 'user' || (username && username !== 'admin'))) {
      return res.status(400).json({ msg: '不能降级或重命名超级管理员' });
    }

    let sql = "UPDATE users SET role = ?";
    let params = [role || 'user'];

    if (username) {
      sql += ", username = ?";
      params.push(username);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      sql += ", password = ?";
      params.push(hashedPassword);
    }

    sql += " WHERE id = ?";
    params.push(id);

    db.run(sql, params, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) return res.status(400).json({ msg: '用户名已存在' });
        return res.status(500).json({ msg: '更新失败' });
      }
      res.json({ msg: '用户信息已更新' });
    });
  });
});

// 5. 新增用户 (管理员专用)
app.post('/api/admin/users', isAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  console.log('[Server] Admin creating user:', username, 'Role:', role);

  if (!username || !password) {
    return res.status(400).json({ msg: '请输入用户名和密码' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role || 'user'], function(err) {
      if (err) {
        console.error('[Server] Create user DB error:', err);
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ msg: '用户名已存在' });
        }
        return res.status(500).json({ msg: '数据库操作失败' });
      }
      console.log('[Server] User created successfully, ID:', this.lastID);
      res.status(201).json({ msg: '用户创建成功', id: this.lastID });
    });
  } catch (err) {
    console.error('[Server] Create user catch error:', err);
    res.status(500).json({ msg: '服务器内部错误' });
  }
});

// --- 公共接口 ---

// 注册
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: '请输入用户名和密码' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ msg: '用户名已存在' });
        }
        return res.status(500).json({ msg: '服务器内部错误' });
      }
      res.status(201).json({ msg: '注册成功' });
    });
  } catch (err) {
    res.status(500).json({ msg: '服务器内部错误' });
  }
});

// 登录
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: '请输入用户名和密码' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ msg: '服务器内部错误' });
    if (!user) return res.status(400).json({ msg: '用户不存在' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: '密码错误' });

    // 强制刷新 admin 的角色，确保即使旧数据没 role 也能登录
    const userRole = user.username === 'admin' ? 'admin' : (user.role || 'user');
    console.log(`[Server] Login successful for user: ${user.username}, Assigned Role: ${userRole}`);

    const token = jwt.sign({ id: user.id, username: user.username, role: userRole }, SECRET_KEY, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, role: userRole } });
  });
});

// 验证 token
app.get('/api/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ msg: '未登录' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ msg: '登录已过期' });

    // 从数据库重新获取最新角色信息 (通过 ID 或用户名)
    const sql = "SELECT id, role, username FROM users WHERE id = ? OR username = ?";
    db.get(sql, [decoded.id, decoded.username], (dbErr, row) => {
      if (row) {
        const finalRole = row.username === 'admin' ? 'admin' : (row.role || 'user');
        console.log(`[Server] /api/me: User ${row.username} verified with role: ${finalRole}`);
        res.json({ user: { ...decoded, id: row.id, role: finalRole } });
      } else {
        console.warn(`[Server] /api/me: User ${decoded.username} (ID: ${decoded.id}) not found in database.`);
        res.json({ user: decoded });
      }
    });
  });
});

// 全局 404
app.use((req, res) => {
  console.warn(`[Server] 404 - Unmatched request: ${req.method} ${req.url}`);
  res.status(404).json({ msg: '请求的接口不存在' });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('[Server] Uncaught Error:', err);
  res.status(500).json({ msg: '服务器发生异常', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
