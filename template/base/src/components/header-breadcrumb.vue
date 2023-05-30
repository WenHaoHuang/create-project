<template>
  <section class="header-breadcrumb">
    <n-icon :component="IconBookmarks" />
    <n-breadcrumb>
      <n-breadcrumb-item
        v-for="matched in breadcrumbs"
        :key="matched.name"
        @click="routerPush(matched)"
      >
        {{ matched.meta.title }}
      </n-breadcrumb-item>
    </n-breadcrumb>
  </section>
</template>
<script setup lang="ts">
import { LogoTwitter as IconBookmarks } from '@vicons/ionicons5';
import { RouteLocationMatched } from 'vue-router';

const breadcrumbs = computed(() => {
  const route = useRoute();
  const matcheds = route.matched;
  return matcheds.filter(matched => (matched.meta && !matched.meta.hideBreadcrumb));
});

const router = useRouter();
const routerPush = (matched: RouteLocationMatched) => {
  router.push(matched);
};
</script>
<script lang="ts">
export default defineComponent({ name: 'HeaderBreadcrumb' });
</script>
<style lang="scss">
.header-breadcrumb {
  padding-left: 10px;
  display: flex;
  align-items: center;
  grid-gap: 10px;
  user-select: none;
}
</style>
