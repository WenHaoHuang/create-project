<template>
  <section
    class="va-tab-bar--container"
    ref="vaRef"
  >
    <div class="va-tab-bar--wrap flex items-center">
      <n-icon
        class="arrow-wrapper"
        size="20"
        :class="{ 'arrow-wrapper__disabled': leftArrowDisabled }"
        @click="leftArrowClick"
      >
        <ChevronBack />
      </n-icon>
      <n-scrollbar
        ref="scrollbarRef"
        :size="0"
        :x-scrollable="true"
      >
        <n-button
          v-for="item of getVisitedRoutes"
          :key="item.path"
          :type="currentTab === item.path ? 'primary' : 'default'"
          class="tab-item"
          size="tiny"
          strong
          secondary
          :data="item.path"
          @click.self="itemClick(item)"
          @contextmenu="onContextMenu(item, $event)"
        >
          <span
            style="margin-top: 2px;font-size: 12px"
            class="text-item"
            @click.self="itemClick(item)"
          >
            {{ item.meta ? item.meta.title : item.name }}
          </span>
          <n-icon
            v-if="!item.meta?.affix"
            class="icon-item"
            @click="removeTab(item)"
          >
            <Close />
          </n-icon>
        </n-button>
      </n-scrollbar>
      <n-icon
        class="arrow-wrapper"
        size="20"
        :class="{ 'arrow-wrapper__disabled': rightArrowDisabled }"
        style="transform: rotate(180deg)"
        @click="rightArrowClick"
      >
        <ChevronBack />
      </n-icon>
      <n-dropdown
        :options="contextMenuOptions"
        placement="left-start"
        @select="onDropDownSelect"
      >
        <n-icon
          class="arrow-wrapper"
          size="20"
          @click="rightArrowClick"
        >
          <IconMenu />
        </n-icon>
      </n-dropdown>
    </div>
    <ul
      v-show="showContextMenu"
      class="context-menu-wrap"
      :style="contextMenuStyle"
    >
      <li @click="refreshRoute">
        <n-icon>
          <Refresh />
        </n-icon>
        刷新页面
      </li>
      <li
        :class="{'is-disabled': showLeftMenu}"
        @click="closeLeft"
      >
        <n-icon>
          <ArrowBack />
        </n-icon>
        关闭左侧
      </li>
      <li
        :class="{'is-disabled': showRightMenu}"
        @click="closeRight"
      >
        <n-icon>
          <ArrowForward />
        </n-icon>
        关闭右侧
      </li>
      <li @click="closeAll">
        <n-icon>
          <Close />
        </n-icon>
        关闭所有
      </li>
    </ul>
  </section>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {
  Close,
  ChevronBack,
  Refresh,
  ArrowBack,
  ArrowForward,
  Menu as IconMenu,
} from '@vicons/ionicons5';

import { useContext } from './hooks';
import { contextMenuOptions } from './contanst';

export default defineComponent({
  name: 'TabBar',
  components: {
    Close,
    ChevronBack,
    Refresh,
    ArrowBack,
    ArrowForward,
    IconMenu,
  },
  setup() {

    const hooks = useContext();
    return {
      ...hooks,
      contextMenuOptions,
    };
  },
});
</script>
<style lang="scss">
$tabHeight: 40px;
$transitionTime: 0.3s ease;
.va-tab-bar {
  &--container {
    position: relative;
    box-sizing: border-box;
    height: $tabHeight;
    line-height: $tabHeight;
    white-space: nowrap;
    border-bottom: 1px solid var(--border-color, #f2f2f2);
    // box-shadow: 10px 5px 10px rgb(0 0 0 / 10%);
    // box-shadow: 0 2px 5px #0000001a;
    .context-menu-wrap {
      position: absolute;
      z-index: 999;
      width: 130px;
      padding: 10px 0;
      margin: 0;
      list-style: none;
      background-color: #fff;
      box-shadow: 0 2px 4px rgb(0 0 0 / 12%), 0 0 6px rgb(0 0 0 / 4%);
      & > li {
        box-sizing: border-box;
        display: flex;
        align-items: center;
        width: 100%;
        height: 40px;
        padding: 5px 15px;
        cursor: pointer;
        .n-icon {
          margin-right: 5px;
        }
        &:hover {
          color: #3370FF;
        }
        &.is-disabled {
          color: #b9b9b9;
          cursor: not-allowed;
        }
      }
    }
    .arrow-wrapper {
      margin: 0 8px;
      cursor: pointer;
      user-select: none;
      &__disabled {
        color: #b9b9b9;
        cursor: not-allowed;
      }
    }
    .tab-item {
      & + .tab-item {
        margin-left: 10px;
      }
      .icon-item {
        width: 0;
        height: 0;
        margin-left: 0;
        overflow: hidden;
        transition: all 0.2s ease-in-out;
      }
      &:hover {
        .icon-item {
          display: inline;
          width: 14px;
          height: 14px;
          padding: 1px;
          margin-left: 5px;
          font-size: 12px;
          background-color: rgb(0 0 0 / 12%);
          border-radius: 50%;
          transition: all 0.2s ease-in-out;
        }
      }
    }
  }
  &--wrap {
    height: $tabHeight;
    display: flex;
    align-items: center;
  }
}
</style>
