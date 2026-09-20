import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../layout/Index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/Index.vue'),
        meta: { title: '效能看板' }
      },
      {
        path: 'generator',
        name: 'Generator',
        component: () => import('../views/generator/Index.vue'),
        meta: { title: 'AI 组件生成' }
      },
      {
        path: 'tester',
        name: 'Tester',
        component: () => import('../views/tester/Index.vue'),
        meta: { title: '接口自动化测试' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router