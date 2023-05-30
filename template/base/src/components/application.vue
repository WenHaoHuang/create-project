<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverThemes"
  >
    <n-dialog-provider>
      <n-spin
        class="app-spin"
        description="努力加载中"
        :show="show"
      >
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-spin>
    </n-dialog-provider>
  </n-config-provider>
</template>
<script lang="ts">
import {
  defineComponent,
  computed,
} from "vue";
import {
  zhCN,
  dateZhCN,
  NDialogProvider,
  GlobalThemeOverrides,
} from 'naive-ui';
import { useLayout } from '@/store/modules/layout';

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export default defineComponent({
  name: 'AppProvider',
  components: { NDialogProvider },
  setup() {
    const layout = useLayout();
    const themeOverThemes = computed<GlobalThemeOverrides>(() => {
      return {
        common: {
          primaryColor: '#409eff',
          primaryColorHover: '#409eff',
        },
      };
    });
    const showSpin = computed(() => layout.getLoading);
    return {
      show: showSpin,
      zhCN,
      dateZhCN,
      themeOverThemes,
    };
  },
});
</script>
<style lang="scss">
.app-spin {
  height: 100%;
  .n-spin-content {
    height: 100%;
  }
}
</style>
