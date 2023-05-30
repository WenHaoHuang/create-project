<template>
  <section
    class="page-container"
    :class="{'is-fullscreen': fullscreen}"
  >
    <section class="page-main">
      <n-scrollbar
        class="page-scrollbar"
        container-class="page-scrollbar--container"
      >
        <section
          class="page-header"
          v-if="hasHeader"
        >
          <slot name="header" />
        </section>
        <section class="page-content">
          <slot name="default" />
        </section>
      </n-scrollbar>
    </section>
    <section
      class="page-footer"
      v-if="hasFooter"
    >
      <slot name="footer" />
    </section>
  </section>
</template>
<script setup lang="ts">
defineProps({
  fullscreen: {
    type: Boolean,
    default: false,
  },
});
// 是否有header
const hasHeader = computed(() => !!useSlots().header);
// 是否有底部
const hasFooter = computed(() => !!useSlots().footer);
</script>
<script lang="ts">
export default defineComponent({ name: 'LayoutPage' });
</script>
<style lang="scss" scoped>
.page {
  &-container {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;
    &.is-fullscreen {
      .page {
        &-content {
          padding: 0;
        }
        &-main {
          :deep(.page-scrollbar) {
            &::before, &::after {
              opacity: 0;
              display: none;
            }
          }
        }
      }
    }
  }
  &-main {
    flex: 1;
    overflow: hidden;
    padding: 5px 0;
    :deep(.page-scrollbar) {
      height: 100%;
      padding: 0 5px;
      position: relative;
      &::before, &::after {
        content: '';
        height: 10px;
        left: 5px;
        right: 15px;
        background-color: #fff;
        position: absolute;
        z-index: 0;
      }
      &::before {
        top: 0;
      }
      &::after {
        bottom: 0;
      }
    }
    :deep(.page-scrollbar--container) {
      background-color: #fff;
    }
  }
  &-content {
    padding: 10px;
  }
  &-footer {
    background-color: #fff;
    border-top: 1px solid var(--border-color, #f2f2f2);
  }
}
</style>
