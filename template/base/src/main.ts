import { App, createApp } from 'vue';

import './style/index.scss';

import { setupRouter } from './router';
import store from '@/store/index';
import { setupNaive } from '@/plugins/naive';


import application from '@/components/application.vue';
import LayoutPage from '@/components/layout-page.vue';

async function render() {
  const root: App = createApp(application);
  root.use(store);
  // 注册全局常用的 naive-ui 组件
  setupNaive(root);
  root.component(LayoutPage.name, LayoutPage);
  // 挂载路由
  const router = setupRouter(root);
  // 路由准备就绪后挂载APP实例
  await router.isReady();
  // 挂载节点
  root.mount("#app");
}

render();
