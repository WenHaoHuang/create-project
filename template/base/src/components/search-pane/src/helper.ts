import { ComponentType } from './types/index';

/**
 * @description: 生成placeholder
 */
const selectComponents = [
  'NPicker',
  'NSelect',
  'NCheckbox',
  'NRadio',
  'NSwitch',
  'NDatePicker',
  'NTimePicker',
];

export function createPlaceholderMessage(component: ComponentType) {
  if (component === 'NInput') return '请输入';
  if (selectComponents.includes(component)) return '请选择';
  return '';
}
