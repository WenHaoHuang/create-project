import { PiniaPluginContext } from 'pinia';
import { toRaw } from 'vue';

interface PresistType<S, Store> {
  enable: boolean
  option: Partial<{
    key: string
    storage: 'local' | 'session'
    include: (keyof S)[]
    exclude: (keyof S)[]
  }>
  resetToState?: ((store: Store) => void) | boolean
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    presist?: Partial<PresistType<S, Store>>
  }
}

export const usePersist = ({ options, store }: PiniaPluginContext) => {
  const presist = options.presist;
  if (presist?.enable !== true) { return; }
  // 设置默认值
  !presist.option && (presist.option = {});
  const key = presist.option.key ?? store.$id;
  presist.option.key = key;
  const storage = presist.option.storage ?? 'local';
  presist.option.storage = storage;
  // 恢复状态
  if (presist.resetToState) {
    if (typeof presist.resetToState === 'boolean') {
      const json = window[`${storage}Storage`].getItem(key);
      if (json) {
        store.$patch(JSON.parse(json));
      }
    } else if (typeof presist.resetToState === 'function') {
      presist.resetToState.call(presist, store);
    }
  }
  // 监听
  store.$subscribe(
    (mutation, state) => {
      const toPersistObj = JSON.parse(JSON.stringify(toRaw(state)));
      const { include, exclude } = presist.option || {};
      if (include || exclude) {
        Object.keys(toPersistObj).forEach(it => {
          if (
            (include && !include.includes(it)) || (exclude && exclude.includes(it))
          ) {
            toPersistObj[it] = undefined;
          }
        });
      }
      window[`${storage}Storage`].setItem(key, JSON.stringify(toPersistObj));
    },
    { detached: true },
  );
};
