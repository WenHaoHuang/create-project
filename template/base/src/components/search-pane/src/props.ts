/**
 * search-pane props
 */
import type { CSSProperties, PropType, ExtractPropTypes } from 'vue';
import { FormSchema } from './types/index';
import type { ButtonProps } from 'naive-ui/lib/button';
import type { GridProps, GridItemProps } from 'naive-ui/lib/grid';

export const formProps = {
  // 标签宽度 固定宽度
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 80,
  },
  // 表单项配置规则
  schemas: {
    type: [Array] as PropType<FormSchema[]>,
    default: () => [],
  },
  // 大小
  size: {
    type: String as PropType<'tiny' | 'small' | 'medium' | 'large'>,
    default: 'medium',
  },
  // 标签位置
  labelPlacement: {
    type: String,
    default: 'left',
  },
  // 是否显示操作按钮（查询/重置）
  showActionButtonGroup: {
    type: Boolean,
    default: true,
  },
  // 显示重置按钮
  showResetButton: {
    type: Boolean,
    default: true,
  },
  // 重置按钮配置
  resetButtonOptions: Object as PropType<Partial<ButtonProps>>,
  // 显示确认按钮
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  // 确认按钮配置
  submitButtonOptions: Object as PropType<Partial<ButtonProps>>,
  // 确认按钮文字
  submitButtonText: {
    type: String,
    default: '查询',
  },
  // 重置按钮文字
  resetButtonText: {
    type: String,
    default: '重置',
  },
  // grid 配置
  gridProps: Object as PropType<GridProps>,
  // gi配置
  giProps: Object as PropType<GridItemProps>,
  // grid 样式
  baseGridStyle: { type: Object as PropType<CSSProperties> },
  // 是否折叠
  collapsed: {
    type: Boolean,
    default: false,
  },
  showFeedback: {
    type: Boolean,
    default: false,
  },
  // 标签后置内容，比如：
  labelSuffix: {
    type: String,
    default: '：',
  },
  submitFunc: {
    type: Function,
    default: undefined,
  },
  resetFunc: {
    type: Function,
    default: undefined,
  },
  submitOnReset: {
    type: Function,
    default: undefined,
  },
  border: {
    type: Boolean,
    default: false,
  },
};

export type FormProps = ExtractPropTypes<typeof formProps>
