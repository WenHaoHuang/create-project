<template>
  <section class="header-menu">
    <span
      v-for="menu in menuList"
      :key="menu.name"
      class="header-menu--item"
      :class="{'active': (menu.groups && menu.groups.includes(currentRoute)) || matcheds.includes(menu.name)}"
      @click="routerLink(menu)"
    >{{ menu.title }}</span>
  </section>
</template>
<script setup lang="ts">
const menuList = [
  { title: '工作台', name: 'Home', groups: ['Home'] },
  { title: '系统管理', name: 'System', groups: ['System'] },
  { title: '数据服务', name: 'DataService', groups: ['DataService'] },
];
const route = useRoute();
const router = useRouter();
const currentRoute = computed(() => route.name as string);
const matcheds = computed(() => route.matched.map(v => v.name));
function routerLink(menu: { name: string, title: string, groups: string[] }) {
  router.push({ name: menu.name }).catch(e => {
    console.log('e', e);
  });
}
</script>
<style lang="scss">
.header-menu {
  display: flex;
  align-items: center;
  &--item {
    display: flex;
    align-items: center;
    height: var(--sac-header-height);
    padding: 3px 10px 0;
    color: var(--n-text-color, #555);
    text-decoration: none;
    cursor: pointer;
    border-bottom: 3px solid transparent;
    transition: background-color 0.2s ease-in-out;
    &.active {
      border-bottom-color: #ed5565;
    }
    &:hover {
      background-color: rgb(0 0 0 / 2.5%);
    }
    & + & {
      border-left: 1px solid rgb(0 0 0 / 5%);
    }
  }
}
</style>
