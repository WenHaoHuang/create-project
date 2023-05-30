<template>
  <n-layout
    class="wrapper-main"
    :has-sider="hasSider"
  >
    <n-layout-sider
      v-if="hasSider"
      bordered
      class="wrapper-sider"
      :inverted="false"
      :width="sacSiderWidth"
      :native-scrollbar="false"
    >
      <layout-sider />
    </n-layout-sider>
    <n-layout-content
      position="static"
      class="wrapper-content"
    >
      <tab-bar />
      <section class="wrapper-view">
        <router-view />
      </section>
    </n-layout-content>
  </n-layout>
</template>
<script setup lang="ts">
import LayoutSider from '@/components/layout-sider.vue';
import TabBar from '@/components/tab-bar/index.vue';

const rootElement = document.querySelector(':root') as HTMLElement;
const rootStyle = getComputedStyle(rootElement);
const sacSiderWidth = rootStyle.getPropertyValue('--sac-sider-width');

defineProps({
  hasSider: {
    type: Boolean,
    default: true,
  },
});
</script>
<script lang="ts">
export default defineComponent({ name: 'ViewLayout' });
</script>

<style lang="scss" scoped>
.wrapper {
  &-main {
    height: 100%;
  }
  &-content {
    height: 100%;
  }
  &-sider {
    box-shadow: 5px 0 5px #0000001a;
  }
  &-view {
    height: calc(100% - 40px);
    position: relative;
  }
}
</style>
