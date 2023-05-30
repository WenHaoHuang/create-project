<template>
  <section class="layout-app">
    <layout-header title="数据管理">
      <template #extra>
        <!-- <header-menu /> -->
        <header-breadcrumb />
      </template>
    </layout-header>
    <section class="layout-app-content">
      <router-view />
    </section>
  </section>
</template>
<script lang="ts" setup>
import LayoutHeader from '@/components/layout-header.vue';
import HeaderBreadcrumb from '@/components/header-breadcrumb.vue';

</script>
<script lang="ts">
export default defineComponent({ name: 'AppLayout' });
</script>
<style lang="scss" scoped>
.layout {
  &-app {
    height: 100vh;
    overflow: hidden;
    &-content {
      height: calc(100% - var(--sac-header-height, 48px));
      overflow: hidden;
    }
  }
}
</style>
