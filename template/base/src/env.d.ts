/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<unknown, unknown, any>;
  export default component;
}

declare module 'qs';

interface ImportMetaEnv {
  readonly VITE_USE_MOCK: boolean
  readonly VITE_TITLE: string
  readonly VITE_PRIMARY_COLOR: string
  readonly VITE_PRIMARY_COLOR_HOVER: string
  readonly VITE_SYSTEM: string
  readonly VITE_ORGID: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  AMap: string;
  _amapInitMap: function;
}
