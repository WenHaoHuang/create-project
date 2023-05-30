<template>
  <section
    class="search-pane"
    :class="{'is-border': border}"
  >
    <n-form
      class="search-pane--main"
      ref="formElRef"
      v-bind="getBindValue"
      :model="formModel"
    >
      <n-grid v-bind="getGrid">
        <template v-for="schema in getSchema">
          <n-gi
            v-bind="schema.giProps"
            :key="schema.field"
            v-if="!(formCollapsed && schema.collapsed)"
          >
            <n-form-item
              :label="schema.label + getProps.labelSuffix"
              :path="schema.field"
              :label-width="schema.labelWidth"
              :style="!!getProps.labelSuffix ? {'--n-label-padding': '0'} : null"
            >
              <!--标签名右侧温馨提示-->
              <template
                #label
                v-if="schema.labelMessage"
              >
                {{ schema.label }}
                <n-tooltip
                  trigger="hover"
                  :style="schema.labelMessageStyle"
                >
                  <template #trigger>
                    <n-icon
                      size="18"
                      class="cursor-pointer text-gray-400"
                    >
                      <QuestionCircleOutlined />
                    </n-icon>
                  </template>
                  {{ schema.labelMessage }}
                </n-tooltip>
              </template>
              <!-- 判断插槽 -->
              <template v-if="schema.slot">
                <slot
                  :name="schema.slot"
                  :model="formModel"
                  :field="schema.field"
                  :value="formModel[schema.field]"
                />
              </template>
              <!-- NCheckbox -->
              <template v-else-if="schema.component === 'NCheckbox'">
                <n-checkbox-group v-model:value="formModel[schema.field]">
                  <n-space>
                    <n-checkbox
                      v-for="item in schema.componentProps?.options"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </n-space>
                </n-checkbox-group>
              </template>
              <!--NRadioGroup-->
              <template v-else-if="schema.component === 'NRadioGroup'">
                <n-radio-group v-model:value="formModel[schema.field]">
                  <n-space>
                    <n-radio
                      v-for="item in schema.componentProps?.options"
                      :key="item.value"
                      :value="item.value"
                    >
                      {{ item.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </template>
              <!--动态渲染表单组件-->
              <component
                v-else
                v-bind="getComponentProps(schema)"
                :is="schema.component"
                v-model:value="formModel[schema.field]"
                :class="{ 'is-full': schema.isFull != false }"
              />
              <!--组件后面的内容-->
              <template v-if="schema.suffix">
                <slot
                  :name="schema.suffix"
                  :model="formModel"
                  :field="schema.field"
                  :value="formModel[schema.field]"
                />
              </template>
            </n-form-item>
          </n-gi>
        </template>
        <n-gi
          v-if="getProps.showActionButtonGroup"
          :span="btnLayout.span"
        >
          <n-space
            align="center"
            :justify="btnLayout.justify"
          >
            <n-button
              type="primary"
              text
              icon-placement="right"
              v-if="showAdvancedButton"
              @click="unfoldToggle"
            >
              <template #icon>
                <n-icon
                  size="14"
                  class="unfold-icon"
                  v-if="formCollapsed"
                >
                  <DownOutlined />
                </n-icon>
                <n-icon
                  size="14"
                  class="unfold-icon"
                  v-else
                >
                  <UpOutlined />
                </n-icon>
              </template>
              {{ formCollapsed ? '展开' : '收起' }}
            </n-button>
            <n-button
              v-if="getProps.showSubmitButton"
              v-bind="getSubmitBtnOptions"
              @click="handleSubmit"
              :loading="loadingSub"
            >
              <template #icon>
                <SearchOutlined />
              </template>
              {{ getProps.submitButtonText }}
            </n-button>
            <n-button
              v-if="getProps.showResetButton"
              v-bind="getResetBtnOptions"
              @click="resetFields"
            >
              {{ getProps.resetButtonText }}
            </n-button>
          </n-space>
        </n-gi>
      </n-grid>
    </n-form>
    <div
      class="search-pane--extra"
      v-if="hasExtra"
    >
      <slot name="extra" />
    </div>
  </section>
</template>
<script lang="ts">
import {
  ref,
  unref,
  Ref,
  watch,
  reactive,
  computed,
  onMounted,
  nextTick,
  defineComponent,
} from 'vue';
import {
  formProps,
  FormProps,
} from './props';
import { deepMerge } from './utils';
import {
  DownOutlined,
  UpOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
} from '@vicons/antd';
import { createPlaceholderMessage } from './helper';
import { useFormEvents, EmitType } from './hooks/useFormEvents';
import { useFormValues } from './hooks/useFormValues';
import { useBreakpoint } from 'vooks';

import type { GridProps } from 'naive-ui/lib/grid';
import type { FormSchema, FormActionType, ComponentType } from './types/index';

export default defineComponent({
  name: 'SearchPane',
  components: {
    DownOutlined,
    UpOutlined,
    QuestionCircleOutlined,
    SearchOutlined,
  },

  props: formProps,
  emits: ['submit', 'reset', 'register'],

  setup(props, { emit, attrs, slots }) {
    // hooks
    const breakPoint = useBreakpoint();

    const defaultFormModel = ref<Recordable>({});
    const propsRef = ref<Partial<FormProps>>({});
    const formModel = reactive<Recordable>({});
    const formElRef = ref<Nullable<FormActionType>>(null);
    // 当前面板折叠状态
    const formCollapsed = ref(true);
    const loadingSub = ref(false);
    const isInline = ref(false);
    const isUpdateDefaultRef = ref(false);

    const getSubmitBtnOptions = computed(() => {
      return Object.assign(
        {
          size: props.size,
          type: 'primary',
        },
        props.submitButtonOptions,
      );
    });

    const getResetBtnOptions = computed(() => {
      return Object.assign(
        {
          size: props.size,
          type: 'default',
        },
        props.resetButtonOptions,
      );
    });

    function getComponentProps(schema: FormSchema) {
      const compProps = schema.componentProps ?? {};
      const component = schema.component as ComponentType;
      return {
        clearable: true,
        placeholder: createPlaceholderMessage(unref(component)),
        ...compProps,
      };
    }

    const getProps = computed((): FormProps => {
      const _formProps = {
        ...props,
        ...unref(propsRef),
      } as FormProps;

      return { ..._formProps };
    });
    const getBindValue = computed(() => ({
      ...attrs,
      ...formProps,
      ...unref(getProps),
    } as Recordable));
    const getGrid = computed((): GridProps => {
      const { gridProps } = unref(getProps);
      return {
        ...gridProps,
        collapsed: false,
        responsive: 'screen',
      };
    });

    const getSchema = computed((): FormSchema[] => {
      const { giProps, schemas } = unref(getProps);
      for (const schema of schemas) {
        const { defaultValue, giProps: giPropsItem } = schema;
        // handle date type
        // dateItemType.includes(component as string)
        if (defaultValue) {
          schema.defaultValue = defaultValue;
        }
        if (giProps || giPropsItem) {
          schema.giProps = Object.assign({}, { ...giProps }, { ...giPropsItem });
        }
      }
      return schemas;
    });
    const { handleFormValues, initDefault } = useFormValues({
      defaultFormModel,
      getSchema,
      formModel,
    });
    // form events
    const {
      handleSubmit,
      resetFields,
      validate,
      getFieldsValue,
      setFieldsValue,
      clearValidate,
    } = useFormEvents({
      emit: emit as EmitType,
      getProps,
      formModel,
      getSchema,
      formElRef: formElRef as Ref<FormActionType>,
      defaultFormModel,
      loadingSub,
      handleFormValues,
    });

    function unfoldToggle() {
      formCollapsed.value = !formCollapsed.value;
    }

    async function setProps(formProps: Partial<FormProps>): Promise<void> {
      propsRef.value = deepMerge(unref(propsRef) || {}, formProps);
    }
    const formActionType: Partial<FormActionType> = {
      getFieldsValue,
      // eslint-disable-next-line
      // @ts-ignore
      setFieldsValue,
      resetFields,
      validate,
      clearValidate,
      setProps,
      submit: handleSubmit,
    };

    const showAdvancedButton = computed(() => {
      return getSchema.value.some(v => v.collapsed);
    });
    const hasExtra = computed(() => !!slots.extra);
    // 按钮区域布局状态
    const btnLayout = reactive({
      // 对齐方式
      justify: 'start' as 'start' | 'end',
      span: '8 xs:8 s:8 m:8 l:8 xl:8 2xl:8' as string | number,
    });
    // 修正栅格布局参数
    const points = ['xs', 's', 'm', 'l', 'xl', '2xl'];
    function fixGridSpan(cols: string | number | number[]) {
      if (typeof cols === 'number') {
        cols = new Array(6).fill(cols);
      } else if(typeof cols === 'string') {
        const list = cols.split(' ');
        cols = new Array(6).fill(0);
        for (const col in list) {
          const [point, span] = list[col].split(':');
          const pointIndex = points.findIndex(v => v === point);
          if(pointIndex > -1) {
            cols[pointIndex] = Number(span);
          } else {
            cols[col] = Number(point);
          }
        }
        for (const col in cols) {
          if (cols[col] === 0) {
            cols[col] = cols.find((v, index) => index > Number(col) && v !== 0) || 0;
          }
        }
        // 处理后面最大值
        for (const col in cols) {
          // 是否最后一个
          if (cols[col] === 0) {
            cols[col] = Math.max(...cols);
          }
        }
      }
      return cols;
    }
    watch(
      [formCollapsed, breakPoint],
      async ([collapsed, responsive]) => {
        await nextTick();
        const { gridProps, giProps } = unref(getProps);
        // 各数据项总栅格占比
        const totalSpan = [0, 0, 0, 0, 0, 0, 0];
        // 表单栅格配置
        const formCols = fixGridSpan(gridProps?.cols || 24);
        const schemas = unref(getSchema);
        let currentBreakPointSpan = 0;
        const currentBreakPoint = points.findIndex(v => v === responsive);
        for(const schema of schemas) {
          const { giProps: itemGiProps, collapsed: itemCollspsed } = schema;
          const schemaSpan = fixGridSpan(itemGiProps?.span || giProps?.span || 1);
          for(const span in schemaSpan) {
            totalSpan[span] += schemaSpan[span];
            if (Number(span) === currentBreakPoint && !(collapsed && itemCollspsed)) {
              currentBreakPointSpan += schemaSpan[span];
            }
          }
        }
        if (totalSpan[currentBreakPoint] + (Number(giProps?.span) || 1) > formCols[currentBreakPoint]) {
          btnLayout.justify = 'end';
        }
        const f = formCols[currentBreakPoint];
        btnLayout.span = f - (currentBreakPointSpan % f);
      },
      { immediate: true },
    );
    watch(
      () => getProps.value.collapsed,
      (newValue) => {
        formCollapsed.value = newValue;
      },
    );

    watch(
      () => getSchema.value,
      (schema) => {
        if (unref(isUpdateDefaultRef)) {
          return;
        }
        if (schema?.length) {
          initDefault();
          isUpdateDefaultRef.value = true;
        }
      },
    );

    onMounted(() => {
      initDefault();
      emit('register', formActionType);
    });

    return {
      formElRef,
      getBindValue,
      getProps,
      formModel,
      getGrid,
      getSchema,
      getComponentProps,
      loadingSub,
      getSubmitBtnOptions,
      handleSubmit,
      getResetBtnOptions,
      resetFields,
      isInline,
      formCollapsed,
      unfoldToggle,
      showAdvancedButton,
      btnLayout,
      hasExtra,
    };
  },
});
</script>
<style lang="scss">
.search-pane {
  padding: 10px;
  display: flex;
  grid-gap: 10px 20px;
  &--main {
    flex: 1;
  }
  &.is-border {
    border-bottom: 1px solid var(--border-color, #f2f2f2);
  }
}
</style>
