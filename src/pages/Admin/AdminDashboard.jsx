import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, activeSessions: 0, totalScenarios: 0 });
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [currentUser, setCurrentUser] = useState({ id: null, username: '', password: '', role: 'user' });

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(u =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('获取统计信息失败');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('获取用户列表失败');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('确定要删除此用户吗？')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || '删除失败');
      }
      setUsers(users.filter(u => u.id !== id));
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleOpenModal = (type, user = { id: null, username: '', password: '', role: 'user' }) => {
    setModalType(type);
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const url = modalType === 'add' ? '/api/admin/users' : `/api/admin/users/${currentUser.id}`;
    const method = modalType === 'add' ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(currentUser)
      });

      const data = await res.json().catch(err => {
        console.error('Failed to parse JSON response:', err);
        throw new Error('服务器返回了非 JSON 格式的内容，请检查后端服务');
      });

      if (!res.ok) throw new Error(data.msg || '操作失败');

      alert(data.msg || '操作成功');
      setShowModal(false);
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="admin-loading">正在进入管理系统...</div>;

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-wrapper">
        
        {/* 顶部导航 */}
        <header className="admin-topbar">
          <div className="admin-logo">ETHICAL PLAY <span>ADMIN</span></div>
          <div className="admin-user-info">
            <span>管理员: {user?.username}</span>
            <button onClick={logout} className="btn-logout">退出</button>
            <button onClick={() => navigate('/')} className="btn-back">返回</button>
          </div>
        </header>

        {/* 统计数据 */}
        <div className="admin-stats">
          <div className="stat-box">
            <div className="stat-num">{stats.totalUsers}</div>
            <div className="stat-desc">总用户数</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{stats.todayScenarios}</div>
            <div className="stat-desc">今日生成场景</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{stats.totalScenarios}</div>
            <div className="stat-desc">历史生成总数</div>
          </div>
        </div>

        {/* 用户列表 */}
        <div className="admin-users">
          <div className="users-header">
            <h2>用户管理系统</h2>
            <div className="users-actions">
              <input
                type="text"
                placeholder="搜索用户名..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn-add" onClick={() => handleOpenModal('add')}>+ 新增用户</button>
            </div>
          </div>

          <table className="simple-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>角色</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>
                    <span className={`tag ${u.role === 'admin' ? 'tag-admin' : 'tag-user'}`}>
                      {u.role === 'admin' ? '管理员' : '普通用户'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleOpenModal('edit', u)} className="btn-edit">编辑</button>
                    <button
                      onClick={() => handleDeleteUser(u.id)}
                      className="btn-delete"
                      disabled={u.username === 'admin'}
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal */}
      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h3>{modalType === 'add' ? '新增用户' : '编辑用户'}</h3>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label>用户名</label>
                <input
                  type="text"
                  value={currentUser.username}
                  onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                  required
                  disabled={modalType === 'edit' && currentUser.username === 'admin'}
                />
              </div>
              <div className="form-group">
                <label>{modalType === 'add' ? '密码' : '重置密码 (留空则不修改)'}</label>
                <input
                  type="password"
                  value={currentUser.password || ''}
                  onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                  required={modalType === 'add'}
                />
              </div>
              <div className="form-group">
                <label>角色权限</label>
                <select
                  value={currentUser.role}
                  onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                  className="role-select"
                  disabled={currentUser.username === 'admin'}
                >
                  <option value="user">普通用户</option>
                  <option value="admin">管理员</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">取消</button>
                <button type="submit" className="submit-btn">{modalType === 'add' ? '创建' : '保存修改'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
