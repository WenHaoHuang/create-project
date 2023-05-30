import {
  ref,
  watch,
  nextTick,
  reactive,
  computed,
} from 'vue';
import {
  useRoute,
  useRouter,
  RouteRecordRaw,
} from 'vue-router';
import { NScrollbar } from 'naive-ui';
import type Scrollbar from 'naive-ui/es/_internal/scrollbar/src/Scrollbar';

import useVisitedRouteStore from '@/store/modules/visited-routes';

export const useContext = () => {
  const route = useRoute();
  const router = useRouter();
  const currentTab = computed(() => route.fullPath);
  const useVisitedRoutes = useVisitedRouteStore();

  const vaRef = ref<Element | null>(null);
  const scrollbarRef = ref<InstanceType<typeof NScrollbar> | null>(null);

  // 右键菜单
  const showContextMenu = ref(false);
  const contextMenuStyle = reactive({
    left: '0',
    top: '0',
    zIndex: 99999,
  });
  const showLeftMenu = ref(true);
  const showRightMenu = ref(true);
  const leftArrowDisabled = ref(true);
  const rightArrowDisabled = ref(true);

  const selectRoute = ref<RouteRecordRaw | null>(null);

  function refreshRoute() {
    const { name, query } = route;
    router.replace({
      name: 'Redirect',
      query: {
        target: name as string,
        params: JSON.stringify(query),
      },
    });
  }
  function closeLeft() {
    if (!selectRoute.value) { return; }
    useVisitedRoutes.closeLeftVisitedView(selectRoute.value).then(() => {
      if (route.fullPath !== selectRoute.value?.path) {
        router.push(useVisitedRoutes.findLastRoutePath());
      }
    });
  }
  function closeRight() {
    if (!selectRoute.value) { return; }
    useVisitedRoutes.closeRightVisitedView(selectRoute.value).then(() => {
      if (route.path !== selectRoute.value?.path) {
        router.push(useVisitedRoutes.findLastRoutePath());
      }
    });
  }
  function closeAll() {
    useVisitedRoutes.closeAllVisitedView().then(() => {
      router.push(useVisitedRoutes.findLastRoutePath());
    });
  }
  function leftArrowClick() {
    scrollbarRef.value?.scrollBy(
      {
        left: -200,
        // debounce: true,
        behavior: 'smooth',
      },
    );
    isDisabledArrow();
  }
  function rightArrowClick() {
    scrollbarRef.value?.scrollBy(
      {
        left: 200,
        // debounce: true,
        behavior: 'smooth',
      },
    );
    isDisabledArrow();
  }
  function onDropDownSelect(cmd: string) {
    switch (cmd) {
    case 'refresh':
      refreshRoute();
      break;
    case 'close':
      closeAll();
      break;
    }
  }
  function handleTabClick(path: string) {
    router.push(path);
  }
  function itemClick(item: RouteRecordRaw) {
    handleTabClick(item.path || item.path || '/');
  }
  function onContextMenu(item: RouteRecordRaw, e: MouseEvent) {
    const { clientX } = e;
    const { x = 0 } = vaRef.value?.getBoundingClientRect() || {};
    e.preventDefault();
    selectRoute.value = item;
    if (selectRoute.value) {
      showLeftMenu.value = isLeftLast(item.path || '/');
      showRightMenu.value = isRightLast(item.path || '/');
      const screenWidth = document.body.clientWidth;
      contextMenuStyle.left = ((clientX + 130) > screenWidth ? (clientX - 130 - x - 15) : (clientX - x + 15)) + 'px';
      contextMenuStyle.top = '25px';
      showContextMenu.value = true;
    }
  }
  function removeTab(item: RouteRecordRaw) {
    useVisitedRoutes.removeVisitedRoute(item).then((lastPath) => {
      router.push(lastPath);
    });
  }
  function isLeftLast(tempRoute: string) {
    return getVisitedRoutes.value.findIndex(v => v.path === tempRoute) === 0;
  }
  function isRightLast(tempRoute: string) {
    return getVisitedRoutes.value.findIndex(v => v.path === tempRoute) === getVisitedRoutes.value.length - 1;
  }
  const getVisitedRoutes = computed(() => useVisitedRoutes.getVisitedRoutes);
  function closeMenu() {
    showContextMenu.value = false;
  }
  async function isDisabledArrow() {
    setTimeout(() => {
      const {
        xBarLeftPx = '0px',
        xBarSizePx = '0px',
        xRailRef,
      } = (scrollbarRef.value?.scrollbarInstRef || {}) as InstanceType<typeof Scrollbar>;
      const scrollLeft = parseInt(xBarLeftPx);
      const barWidth = parseInt(xBarSizePx);
      const { clientWidth: barClientWidth = 0 } = xRailRef || {};
      leftArrowDisabled.value = scrollLeft <= 10;
      rightArrowDisabled.value = barClientWidth - barWidth - scrollLeft <= 10;
    }, 500);
  }
  function initScroll() {
    const el: HTMLElement | null = document.querySelector(`[data="${currentTab.value}"]`);
    if (el) {
      scrollbarRef.value?.scrollTo({
        left: el.offsetLeft,
        // debounce: true,
        behavior: 'smooth',
      });
      isDisabledArrow();
    }
  }
  watch(
    () => route.path,
    async () => {
      await nextTick();
      initScroll();
    },
    { immediate: true },
  );
  watch(
    () => showContextMenu.value,
    (val) => {
      if (val) {
        document.body.addEventListener('click', closeMenu);
      } else {
        document.body.removeEventListener('click', closeMenu);
      }
    },
  );
  return {
    vaRef,
    scrollbarRef,
    currentTab,
    showContextMenu,
    contextMenuStyle,
    showLeftMenu,
    showRightMenu,
    leftArrowDisabled,
    rightArrowDisabled,
    refreshRoute,
    closeLeft,
    closeRight,
    closeAll,
    leftArrowClick,
    rightArrowClick,
    onDropDownSelect,
    itemClick,
    onContextMenu,
    removeTab,
    getVisitedRoutes,
  };
};
