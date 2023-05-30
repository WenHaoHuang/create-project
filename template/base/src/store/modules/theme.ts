import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
  state: () => {
    return { darkMode: false };
  },
  getters: {
    getThemeMode(state) {
      return state.darkMode ? 'dark' : 'light';
    },
  },
  actions: {
    /** 设置暗黑模式 */
    setDarkMode(darkMode: boolean) {
      this.darkMode = darkMode;
    },
    /** 切换/关闭 暗黑模式 */
    toggleDarkMode() {
      this.darkMode = !this.darkMode;
    },
  },
});

export default useThemeStore;
