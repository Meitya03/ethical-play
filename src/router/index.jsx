// 导入路由核心组件
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// 导入页面组件
import Home from '../pages/Home/index';
import SelectRole from '../pages/SelectRole/index';
import EthicalCase from '../pages/EthicalCase/index.jsx';
import MutiRound from '../pages/mutiRound/index.jsx';
import History from '../pages/History/index.jsx';
import Login from '../pages/Auth/Login.jsx';
import Register from '../pages/Auth/Register.jsx';
import AdminDashboard from '../pages/Admin/AdminDashboard.jsx';
import NotFound from '../pages/NotFound/index';
import { useAuth, AuthProvider } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// 路由守卫组件
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>加载中...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 管理员路由守卫
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log('[AdminRoute] user:', user, 'loading:', loading);

  if (loading) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '20%' }}>正在验证权限...</div>;
  }

  if (!user || user.role !== 'admin') {
    console.warn('[AdminRoute] Access Denied:', user);
    return <Navigate to="/" replace />;
  }

  console.log('[AdminRoute] Access Granted.');
  return children;
};

// 1. 创建路由规则
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminDashboard />
      </AdminRoute>
    )
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/select-role',
    element: (
      <ProtectedRoute>
        <SelectRole />
      </ProtectedRoute>
    )
  },
  {
    path: '/ethical-case',
    element: (
      <ProtectedRoute>
        <EthicalCase />
      </ProtectedRoute>
    )
  },
  {
    path: '/muti-round',
    element: (
      <ProtectedRoute>
        <MutiRound />
      </ProtectedRoute>
    )
  },
  {
    path: '/history',
    element: (
      <ProtectedRoute>
        <History />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

// 2. 封装路由组件，供全局使用
const AppRouter = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default AppRouter;
