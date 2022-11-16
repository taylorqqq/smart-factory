<template>
  <Modal
    v-model:visible="visible"
    :title="title"
    :width="width"
    :destroyOnClose="true"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="loading"
  >
    <!-- 底部插槽 -->
    <template #footer>
      <div class="my-footer">
        <Button type="success" @click="handleOk" :loading="loading">
          保存
        </Button>
        <Button type="primary" @click="handleResetAll">全部清空</Button>
        <Button @click="handleCancel">取消</Button>
      </div>
    </template>

    <Spin :spinning="loading">
      <Form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :scrollToFirstError="true"
        preserve="false"
      >
        <!-- labelAlign="left" -->
        <Row>
          <Col :span="12" v-for="item in newFormItemList" :key="item.id">
            <FormItem :label="item.label" v-bind="validateInfos[item.key]">
              <!-- :default-active-first-option="false" -->
              <!-- 动态绑定data-v -->
              <Select
                :id="item.key"
                v-model:value="modelRef[item.key]"
                :options="item.options"
                show-search
                :show-arrow="false"
                :filter-option="false"
                :not-found-content="null"
                @search="
                  (val) => {
                    handleSearch(val, item.key);
                  }
                "
                @change="handleChange"
                @blur="handleBlur"
              >
                <template #dropdownRender="{ menuNode: menu }">
                  <v-nodes :vnodes="menu" />
                  <Divider style="margin: 4px 0" />
                  <div
                    style="padding: 4px 8px; cursor: pointer"
                    @mousedown="(e) => e.preventDefault()"
                    @click="handleReset(item)"
                  >
                    <Button type="primary" size="small">清空</Button>
                  </div>
                </template>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Spin>
  </Modal>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    VNodes: (_, { attrs }) => {
      return attrs.vnodes;
    },
  },
});
</script>
<script setup>
import {
  Modal,
  Button,
  Form,
  Spin,
  Input,
  Select,
  Row,
  Col,
  Divider,
} from "ant-design-vue";
import { ref, getCurrentInstance, defineComponent, reactive, toRaw } from "vue";
import { FormItemList } from "@/utils/enterForm";

const FormItem = Form.Item;
const { Option } = Select;
const { Password } = Input;
const useForm = Form.useForm;

const width = "1000px";
const title = "信息录入";
const visible = ref(false);
const currentRecord = ref({});
const labelCol = { span: 6 };
const wrapperCol = { span: 16 };
const loading = ref(false);
const midValue = ref("");
const midKey = ref("");

// 把 FormItemList 内部的数据转换成响应式数据
const newFormItemList = FormItemList.map((item) => {
  return reactive(item);
});
// 根据 FormItemList 生成一个空对象
const modelRef = reactive(
  FormItemList.reduce((pre, cur) => {
    pre[cur.key] = "";
    return pre;
  }, {})
);
// 根据 FormItemList 生成校验规则
const rulesRef = reactive(
  FormItemList.reduce((acc, cur) => {
    acc[cur.key] = [
      {
        required: cur.required,
        message: `请输入${cur.label}`,
      },
    ];
    return acc;
  }, {})
);

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = (record = {}) => {
  resetFields();
  currentRecord.value = record;
  visible.value = true;
};

const handleSearch = (val, key) => {
  midKey.value = key;
  if (val) {
    midValue.value = val;
  }
  console.log("midKey", midKey.value);
  console.log("midValue", midValue.value);
};
const handleChange = (val) => {
  console.log(val);
};

const handleBlur = () => {
  // 把数据存储到 modelRef 中
  modelRef[midKey.value] = midValue.value;
  // options 中的数据也要更新
  newFormItemList.forEach((item) => {
    if (item.key === midKey.value) {
      item.options.push({ label: midValue.value, value: midValue.value });
      // 去重
      item.options = item.options.filter(
        (option, index, self) =>
          index === self.findIndex((t) => t.value === option.value)
      );
    }
  });
};

const handleOk = () => {
  validate()
    .then(() => {
      loading.value = true;
      console.log(toRaw(modelRef));
      setTimeout(() => {
        loading.value = false;
        close();
      }, 3000);
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const handleReset = (item) => {
  // 清空 options 中的数据
  newFormItemList.forEach((it) => {
    if (it.key === item.key) {
      it.options = [];
    }
  });
  // 失去焦点
  const el = document.getElementById(item.key);
  // el.blur();
  // 如何跟在原有blur事件后面执行
  el.dispatchEvent(new Event("blur"));
  // 清空 modelRef 中的数据
  modelRef[item.key] = "";
  // 清空 midValue 中的数据
  midValue.value = "";
  // 清空 midKey 中的数据
  midKey.value = "";
  // 清空options中的数据
  item.options = [];
};

const handleResetAll = () => {
  resetFields();
};

const handleCancel = () => {
  close();
};
const close = () => {
  visible.value = false;
};
defineExpose({
  handleOk,
  handleCancel,
  open,
});
</script>
<style lang="less" scoped>
.my-footer {
  width: 60%;
  margin-left: 20%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}
</style>
