import { createRouter, createWebHistory } from 'vue-router'

// 直接删除错误的routes导入行
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginRegister.vue'),
    },
    {
      path: '/role',
      name: 'role',
      component: () => import('../views/RoleSelectView.vue'),
    },
    {
      path: '/scenario',
      name: 'scenario',
      component: () => import('../views/ScenarioMain.vue'),
    },
    {
      path: '/feedback',
      name: 'feedback',
      component: () => import('../views/DecisionFeedback.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../views/UserCenter.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// 可选：添加简单的登录守卫（示例，可根据你的业务调整）
router.beforeEach((to, from, next) => {
  // 没有检查 token，直接 next()
  next()
})

export default router
