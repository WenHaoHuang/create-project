import { provide, inject, App } from 'vue';

const key = Symbol('formElRef');

export function createFormContext(instance: App) {
  provide(key, instance);
}

export function useFormContext() {
  return inject(key);
}
