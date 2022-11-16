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
    <Spin :spinning="loading">
      <Form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :scrollToFirstError="true"
        preserve="false"
        :model="modelRef"
      >
        <Row>
          <Col
            :span="12"
            v-for="item in newFormLabelRequireList"
            :key="item.id"
          >
            <FormItem :label="item.label">
              <Space>
                <span style="width: 40px; font-size: 12px">显示</span>
                <Checkbox
                  v-model:checked="item.show"
                  @change="handleChangeSetting(item)"
                ></Checkbox>
                <InputNumber
                  type="number"
                  v-model:value="item.sort"
                  :min="1"
                  style="width: 150px"
                  placeholder="请输入序号"
                  @focus="handleFocus(item)"
                ></InputNumber>
              </Space>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Spin>
  </Modal>
</template>
<script setup>
import {
  Modal,
  Button,
  Form,
  Spin,
  Input,
  Row,
  Col,
  Checkbox,
  InputNumber,
  Space,
} from "ant-design-vue";
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { ref, getCurrentInstance, defineComponent, reactive, toRaw } from "vue";
// import { FormLabelRequireList } from "@/utils/enterForm";
import { useSystemStore } from "@/store/system";

const { setFormLabelRequireList } = useSystemStore();

const FormItem = Form.Item;
const useForm = Form.useForm;

const { emit, proxy } = getCurrentInstance(); // 获取当前实例的 emits

// Invalid prop: type check failed for prop "onOk". Expected Function, got Array

const width = "800px";
const title = "界面显示参数调整";
const visible = ref(false);
const currentRecord = ref({});
const labelCol = { span: 8 };
const wrapperCol = { span: 14 };
const loading = ref(false);

// 把 FormLabelRequireList 内部的数据转换成响应式数据
// let newFormLabelRequireList = FormLabelRequireList.map((item) => {
//   return reactive(item);
// });
let newFormLabelRequireList = ref(
  JSON.parse(localStorage.getItem("formLabelRequireList")).map((item) => {
    return reactive(item);
  })
);

const modelRef = reactive({});

// const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = (record = {}) => {
  // resetFields();
  currentRecord.value = record;
  visible.value = true;
};
const handleOk = () => {
  const data = toRaw(modelRef);
  localStorage.setItem(
    "formLabelRequireList",
    JSON.stringify(newFormLabelRequireList.value)
  );
  setFormLabelRequireList(newFormLabelRequireList.value);
  const newData = newFormLabelRequireList.value.filter((item) => item.show);
  emit("callBack", newData);
  visible.value = false;
};

const handleChangeSetting = (item) => {
  //最多可设置9个
  if (newFormLabelRequireList.value.filter((item) => item.show).length > 9) {
    item.show = false;
    proxy.$message.error("最多可设置9个");
    return;
  }

  if (!item.show) {
    item.sort = null;
  }
  if (item.show) {
    item.sort = 1;
  }
};

const handleFocus = (item) => {
  if (item.show) {
    return;
  }
  if (newFormLabelRequireList.value.filter((item) => item.show).length >= 9) {
    proxy.$message.error("最多可设置9个");
    return;
  }
  if (!item.show) {
    item.show = true;
  }
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
<style lang=""></style>
