
import {  Component } from 'vue';

export interface ActionItem {
  label: string;
  command: string;
  type?: 'primary' | 'default' | 'warning' | 'error' | 'info' | 'tertiary';
  icon?: Component;
  disabled?: boolean;
  size?: 'tiny' | 'small' | 'medium' | 'large';
  click?: () => void;
}
