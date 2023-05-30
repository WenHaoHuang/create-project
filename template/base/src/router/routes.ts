
import { RouteRecordRaw } from 'vue-router';
import {
  SpeedometerOutline,
  SettingsOutline,
} from '@vicons/ionicons5';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'Home',
    redirect: { name: 'WorkPlace' },
    component: () => import('@/components/layout-view.vue'),
    props: { hasSider: false },
    meta: {
      title: 'Dashborad',
      icon: SpeedometerOutline,
      affix: true,
      // hideMenu: true,
    },
    children: [
      {
        path: '/work-place',
        name: 'WorkPlace',
        component: () => import('@/views/work-place/index.vue'),
        meta: {
          title: '工作台',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/system',
    name: 'System',
    redirect: { name: 'SystemRole' },
    component: () => import('@/components/layout-view.vue'),
    meta: {
      title: '系统管理',
      icon: SettingsOutline,
      affix: true,
    },
    children: [
      {
        path: 'role',
        name: 'SystemRole',
        redirect: { name: 'SystemRoleDetail' },
        // component: () => import('@/views/home/index.vue'),
        component: () => import('@/components/layout-router.vue'),
        meta: {
          title: '角色管理',
          // icon: SpeedometerOutline,
          affix: true,
        },
        children: [
          {
            path: 'detail',
            name: 'SystemRoleDetail',
            component: () => import('@/views/home/index.vue'),
            meta: {
              title: '角色管理',
              // icon: SpeedometerOutline,
              affix: true,
            },
          },
        ],
      },
    ],
  },
];

export default routes;
