import { App } from 'vue';
import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouteRecordName,
  Router,
} from 'vue-router';
import useVisitedRouteStore from '@/store/modules/visited-routes';

import pages from './routes';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    redirect: { name: 'Layout' },
  },
  {
    path: '/layout',
    name: 'Layout',
    redirect: { name: 'Home' },
    component: () => import('@/components/layout-app.vue'),
    meta: {
      title: '首页',
      hideBreadcrumb: true,
      hideMenu: true,
    },
    children: [
      ...pages,
    ],
  },
  {
    path: '/redirect',
    name: 'Redirect',
    component: () => import('@/views/redirect'),
    meta: {
      title: '中转路由',
      hideMenu: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/components/not-found.vue'),
    meta: {
      title: 'NotFound',
      hideMenu: true,
    },
  },
];
// 路由白名单
export const whiteRoutes: Array<RouteRecordName | null | undefined> = ['Redirect', 'NotFound'];

let router: Router | null = null;

export function setupRouter(app: App) {
  const routerBase = '/';
  router = createRouter({
    history: createWebHashHistory(routerBase),
    routes,
  });
  // 路由拦截
  router.beforeEach(async (to) => {
    const { name } = to;
    if (!whiteRoutes.includes(name)) {
      const visitedRouteStore = useVisitedRouteStore();
      visitedRouteStore.addVisitedRoute(to as unknown as RouteRecordRaw);
    }
  });
  app.use(router);
  return router;
}
export function useRouterContext() {
  return router;
}
export default router;
