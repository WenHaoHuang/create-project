import { h, Component } from 'vue';
import { NIcon } from 'naive-ui';
/**
 * render 图标
 * */
export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export const format = (timestamp: number | Date, fmt?: string) => {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
  if (timestamp == undefined) {
    timestamp = new Date().getTime();
  } else if (String(timestamp).length == 10) {
    timestamp = (timestamp as number) * 1000;
  }
  timestamp = new Date(timestamp);
  type O = {
    [key: string]: number
  }
  const o: O = {
    'y+': timestamp.getFullYear(),
    'M+': timestamp.getMonth() + 1,
    'd+': timestamp.getDate(),
    'h+': timestamp.getHours(),
    'm+': timestamp.getMinutes(),
    's+': timestamp.getSeconds(),
  };
  for (const k in o) {
    const matchs: string[] | null = fmt.match(new RegExp(`(${k})`));
    if (matchs) {
      const str: string = matchs[1];
      const value = k === 'y+' ? String(o[k]).substring(4 - str.length, 4) : String(o[k]).padStart(str.length, '0');
      fmt = fmt.replace(str, value);
    }
  }
  return fmt;
};

/**
 * 中划线字符驼峰
 * @param {*} str 要转换的字符串
 * @returns 返回值
 */
export function toHump(str: string): string {
  if (!str) return str;
  return str
    .replace(/\-(\w)/g, function (all, letter) {
      return letter.toUpperCase();
    })
    .replace(/(\s|^)[a-z]/g, function (char) {
      return char.toUpperCase();
    });
}
