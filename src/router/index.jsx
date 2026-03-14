// 导入路由核心组件
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// 导入页面组件
import Home from '../pages/Home/index';
import CaseScene from '../pages/CaseScene/index';
import EthicalCase from '../pages/EthicalCase/index.jsx';
import NotFound from '../pages/NotFound/index'; 

// 1. 创建路由规则
const router = createBrowserRouter([
  {
    path: '/', // 首页路径
    element: <Home />, // 对应组件
    errorElement: <NotFound /> // 路由错误时显示404
  },
  {
    path: '/case-scene', // 案例场景路径
    element: <CaseScene />, // 对应组件
    errorElement: <NotFound /> // 路由错误时显示404
  },
  {
    path: '/ethical-case', // AI 伦理案例路径
    element: <EthicalCase />, // 对应组件
    errorElement: <NotFound /> // 路由错误时显示404
  },
  {
    path: '*', // 匹配所有未定义的路径（404）
    element: <NotFound />
  }
]);

// 2. 封装路由组件，供全局使用
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;