import { defineStore } from 'pinia';
import store from '@/store/index';


interface IState {
  loading: boolean;
}

export const useLayout = defineStore({
  id: 'layout',
  // 持久化存储
  // presist: {
  //   enable: true,
  //   // option: {
  //   //   key: 'layout',
  //   //   storage: 'local',
  //   // },
  // },
  state: (): IState => ({ loading: false }),
  getters: {
    // 类似组件的computed,用来封装计算属性,用缓存功能
    // 若使用this,则必须手动指定返回类型,否则类型推导不出
    // 函数接受一个可选对象state
    getLoading(state) {
      return state.loading;
    },
  },
  actions: {
    changeStatus(status = true) {
      this.loading = status;
    },
  },
});

export function useLayoutStoreContext() {
  return useLayout(store);
}
