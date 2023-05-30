<template>
  <n-space
    class="tool-bar"
    :size="size === 'tiny' ? 'small' : size"
    :class="{'is-border': border}"
    :justify="justify"
  >
    <n-button
      v-for="btn in commands"
      :key="btn.command"
      :size="size"
      v-bind="btn"
      @click="onClick(btn)"
    >
      <template
        #icon
        v-if="btn.icon"
      >
        <n-icon :component="btn.icon" />
      </template>
      {{ btn.label }}
    </n-button>
    <slot
      name="others"
    />
  </n-space>
</template>
<script lang="ts" setup>
import { PropType } from 'vue';
import { ActionItem } from './types';

type Justify = 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly';

defineProps({
  commands: {
    type: Array as PropType<ActionItem[]>,
    default: () => [],
  },
  border: {
    type: Boolean,
    default: true,
  },
  justify: {
    type: String as PropType<Justify>,
    default: 'start',
  },
  size: {
    type: String as PropType<'tiny' | 'small' | 'medium' | 'large'>,
    default: 'small',
  },
});
const emits = defineEmits(['command']);

function onClick(item: ActionItem) {
  if (item.click) {
    item.click();
  } else {
    emits('command', item.command);
  }
}

</script>
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({ name: 'ToolBar' });
</script>
<style lang="scss" scoped>
.tool-bar {
  &.is-border {
    padding: 10px;
    border-bottom: 1px solid var(--border-color, #f2f2f2);
  }
}
</style>
