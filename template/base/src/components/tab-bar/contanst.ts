import {
  h,
  Component,
} from 'vue';
import { NIcon } from 'naive-ui';
import {
  Close,
  Refresh,
} from '@vicons/ionicons5';

const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, { default: () => h(icon) });
  };
};

export const contextMenuOptions = [
  {
    label: '刷新页面',
    key: 'refresh',
    icon: renderIcon(Refresh),
  },
  {
    label: '关闭所有',
    key: 'close',
    icon: renderIcon(Close),
  },
];
