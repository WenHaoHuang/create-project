<template>
  <n-menu
    class="layout-sider"
    :options="menus"
    :inverted="false"
    :accordion="true"
    :indent="32"
    :root-indent="10"
    :value="defaultValue"
    @update:value="handleUpdateValue"
  />
</template>
<script lang="ts" setup>
import { RouteRecordRaw } from 'vue-router';
import { NIcon } from 'naive-ui';
import type { MenuOption } from 'naive-ui';

const route = useRoute();
const router = useRouter();
// 菜单当前选中
const defaultValue = computed(() => route.name as string | null);

const menus = computed(() => {
  function renderIcon (icon: Component) {
    return () => h(NIcon, null, { default: () => h(icon) });
  }
  const dfs = (list: RouteRecordRaw[]) => {
    const menu: MenuOption[] = [];
    list.forEach(({ name, meta: { title, hideMenu, icon } = {}, children }) => {
      if (hideMenu === true) { return; }
      const menuItem: MenuOption = { label: title as string, key: name as string, icon: icon ? renderIcon(icon as Component) : undefined };
      if (children && children.length) {
        const childList = dfs(children);
        if (childList.length) {
          menuItem.children = childList;
        }
      }
      menu.push(menuItem);
    });

    return menu;
  };
  const { options: { routes } } = router;
  const list = (routes.find(v => v.name === 'Layout') || {}).children || [];
  return dfs(list);
});
const handleUpdateValue = (key: string) => {
  // defaultValue.value = key;
  router.push({ name: key });
};
</script>
<script lang="ts">
export default defineComponent({ name: 'LayoutSider' });
</script>
