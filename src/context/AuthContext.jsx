import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log('[AuthContext] Fetched user from /api/me:', data);
        if (data.user) {
          // 强制修正 admin 角色 (兼容老旧 token)
          const updatedUser = {
            ...data.user,
            role: data.user.username === 'admin' ? 'admin' : (data.user.role || 'user')
          };
          setUser(updatedUser);
        } else {
          localStorage.removeItem('token');
        }
      })
      .catch((err) => {
        console.error('[AuthContext] Fetch /api/me error:', err);
        localStorage.removeItem('token');
      })
      .finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    console.log('Attempting login for:', username);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      console.log('Login response:', data);
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, msg: data.msg || '登录失败' };
      }
    } catch (error) {
      console.error('Login fetch error:', error);
      return { success: false, msg: '无法连接到服务器，请检查后端服务是否启动' };
    }
  };

  const register = async (username, password) => {
    console.log('Attempting register for:', username);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      console.log('Register response:', data);
      if (res.ok) {
        return { success: true };
      } else {
        return { success: false, msg: data.msg || '注册失败' };
      }
    } catch (error) {
      console.error('Register fetch error:', error);
      return { success: false, msg: '无法连接到服务器，请检查后端服务是否启动' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
