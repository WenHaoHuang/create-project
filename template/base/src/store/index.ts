import { createPinia } from "pinia";
import { usePersist as PersistPlugin } from './plugin/persist';

const pinia = createPinia();
// 持久化插件
pinia.use(PersistPlugin);

export default pinia;
