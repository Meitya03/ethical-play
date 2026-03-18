// 导入路由核心组件
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// 导入页面组件
import Home from '../pages/Home/index';
import SelectRole from '../pages/SelectRole/index';
import EthicalCase from '../pages/EthicalCase/index.jsx';
import NotFound from '../pages/NotFound/index';

// 1. 创建路由规则
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/select-role',
    element: <SelectRole />
  },
  {
    path: '/ethical-case',
    element: <EthicalCase />
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

// 2. 封装路由组件，供全局使用
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
