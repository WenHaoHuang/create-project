<template>
  <layout-page fullscreen>
    <template #header>
      <tool-bar
        size="small"
        :commands="commands"
        :border="true"
      />
      <search-pane
        v-bind="searchPaneProps"
        @submit="handleSubmit"
      />
      <search-pane
        v-bind="searchPaneProps"
        @submit="handleSubmit"
      >
        <template #extra>
          <tool-bar
            size="small"
            :commands="commands"
            :border="false"
          />
        </template>
      </search-pane>
    </template>
    <template #default>
      我们在田野上面找猪<br>
      想象中已找到了三只<br>
      小鸟在白云上面追逐<br>
      它们在树底下跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      想象中我们是如此的疯狂<br>
      我们在城市里面找猪<br>
      想象中已找到了几百万只<br>
      小鸟在公园里面唱歌<br>
      它们独自在想象里跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      许多年之后我们又开始想象<br>
      啦啦啦啦啦啦啦啦咧<br>
      我们在田野上面找猪<br>
      想象中已找到了三只<br>
      小鸟在白云上面追逐<br>
      它们在树底下跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      想象中我们是如此的疯狂<br>
      我们在城市里面找猪<br>
      想象中已找到了几百万只<br>
      小鸟在公园里面唱歌<br>
      它们独自在想象里跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      许多年之后我们又开始想象<br>
      啦啦啦啦啦啦啦啦咧<br>
      我们在田野上面找猪<br>
      想象中已找到了三只<br>
      小鸟在白云上面追逐<br>
      它们在树底下跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      想象中我们是如此的疯狂<br>
      我们在城市里面找猪<br>
      想象中已找到了几百万只<br>
      小鸟在公园里面唱歌<br>
      它们独自在想象里跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      许多年之后我们又开始想象<br>
      啦啦啦啦啦啦啦啦咧<br>
      我们在田野上面找猪<br>
      想象中已找到了三只<br>
      小鸟在白云上面追逐<br>
      它们在树底下跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      想象中我们是如此的疯狂<br>
      我们在城市里面找猪<br>
      想象中已找到了几百万只<br>
      小鸟在公园里面唱歌<br>
      它们独自在想象里跳舞<br>
      啦啦啦啦啦啦啦啦咧<br>
      啦啦啦啦咧<br>
      我们在想象中度过了许多年<br>
      许多年之后我们又开始想象<br>
      啦啦啦啦啦啦啦啦咧
    </template>
  </layout-page>
</template>
<script lang="ts" setup>
import { ToolBar, ActionItem } from '@/components/tool-bar/index';
import { SearchPane, FormProps, FormSchema } from '@/components/search-pane/index';

const commands: ActionItem[] = [
  {
    label: '新增',
    command: 'add',
    type: 'primary',
  },
  {
    label: '删除',
    command: 'delete',
    type: 'warning',
  },
];

type SearchData = {
  name: string;
}

const searchPaneSchemas: FormSchema[] = [
  {
    field: 'keywords',
    component: 'NInput',
    label: '模型名称',
    componentProps: {
      filterable: true,
      placeholder: '请输入',
    },
    defaultValue: '',
  },
];

const searchPaneProps: Partial<FormProps> = {
  gridProps: { cols: 24, xGap: 10, yGap: 10 },
  giProps: { span: 8 },
  labelWidth: '80',
  size: 'small',
  border: true,
  schemas: searchPaneSchemas,
};

const handleSubmit = (model: Partial<SearchData>) => {
  // Object.assign(searchData, model);
  // pagination.page = 1;
  // checkedRowKeys.value = [];
  // queryList();
  console.log(model);
};
// do something
</script>
<script lang="ts">
export default defineComponent({ name: 'PageWorkPlace' });
</script>
<style lang="scss" scoped>
// do something
</style>
