<template>
  <section class="layout-header">
    <div class="layout-header--logo" />
    <div class="layout-header--title">
      {{ title }}
    </div>
    <div class="layout-header--extra">
      <slot name="extra" />
    </div>
    <div class="layout-header--side">
      <div
        class="layout-header--side-item link"
        v-for="(side, index) in sideList"
        :key="index"
      >
        <a
          v-if="side.href"
          :href="side.href"
          :title="side.title"
          class="item"
        >
          <n-icon :component="side.icon" />{{ side.title }}
        </a>
        <n-dropdown
          v-else-if="side.dropdown"
          placement="bottom-end"
          :options="side.options"
          @select="side.handleSelect"
        >
          <span class="user-info item">
            <n-icon
              :size="side.size"
              :component="side.icon"
            />
            <span>{{ side.title }}</span>
            <n-icon
              v-if="side.suffIcon"
              :component="side.suffIcon"
            />
          </span>
        </n-dropdown>
        <span v-else>
          <n-tooltip
            trigger="hover"
          >
            <template #trigger>
              <span
                class="item"
                @click="side.handleSelect"
              >
                <n-icon
                  :size="14"
                  :component="side.icon"
                />
              </span>
            </template>
            {{ side.title }}
          </n-tooltip>
        </span>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
// import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from '@/store/modules/theme';
import {
  Home as IconHome,
  Mail as IconMail,
  CaretDown,
  PersonCircleOutline,
  SunnyOutline,
  MoonOutline,
  RefreshSharp,
} from '@vicons/ionicons5';

interface SideItem {
  title: string;
  icon: Component;
  size?: number;
  suffIcon?: Component;
  dropdown?: boolean;
  href?: string;
  options?: Array<{label: string; key: string}>;
  handleSelect?: ((k: string) => Promise<void>) | (() => void)
}

defineProps({
  title: {
    type: String,
    default: null,
  },
});

// 当前主题配置
const theme = useThemeStore();
const router = useRouter();

const darkMode = computed(() => theme.darkMode);
const handleSelect = async (key: string) => {
  if (key === 'logout') {
    // await user.logout();
    router.replace({ name: 'Login' });
  } else {
    router.push({ path: key });
  }
};
const sideList = computed<SideItem[]>(() => {
  return [
    { title: '首页', icon: IconHome, href: '#/home' },
    { title: '消息', icon: IconMail, href: '#/message' },
    {
      title: '主题模式',
      icon: darkMode.value ? MoonOutline : SunnyOutline,
      handleSelect: () => {
        theme.toggleDarkMode();
      },
    },
    {
      title: '重新加载',
      icon: RefreshSharp,
      handleSelect: () => {
        // theme.toggleDarkMode();
        console.log('refresh');
      },
    },
    {
      title: 'Admin',
      icon: PersonCircleOutline,
      size: 28,
      suffIcon: CaretDown,
      dropdown: true,
      options: [
        { label: '个人资料', key: "#/usercenter/info" },
        { label: '修改密码', key: "#/usercenter/password" },
        { label: '退出登录', key: "logout" },
      ],
      handleSelect,
    },
  ];
});
</script>
