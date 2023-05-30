import { RouteRecordRaw } from 'vue-router';

export function findCachedRoutes(routes: Array<RouteRecordRaw>) {
  const temp = [] as Array<string>;
  routes.forEach((it) => {
    if (it.name && it.meta && it.meta.cacheable) {
      temp.push(it.name as string);
    }
  });
  return temp;
}
