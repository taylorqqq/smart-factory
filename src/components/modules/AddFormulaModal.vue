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
          <Col :span="24">
            <FormItem label="配方名称" v-bind="validateInfos.title">
              <Input v-model:value="modelRef.title"> </Input>
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
  Select,
  Row,
  Col,
} from "ant-design-vue";
import {
  PlusSquareOutlined,
  PlusOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons-vue";
import {
  ref,
  getCurrentInstance,
  defineComponent,
  reactive,
  toRaw,
  proxyRefs,
} from "vue";
import { addFormula } from "@/api/api";

const FormItem = Form.Item;
const { Option } = Select;
const useForm = Form.useForm;

const { emit, proxy } = getCurrentInstance();

const formulaList = ref([]);

const width = "500px";
const title = "新增配方";
const visible = ref(false);
const currentRecord = ref({});
const labelCol = { span: 5 };
const wrapperCol = { span: 17 };
const loading = ref(false);

const flawOptions = ref([]);

const modelRef = reactive({
  title: "",
});
const rulesRef = reactive({
  title: [
    {
      required: true,
      message: "请输入配方名称",
    },
  ],
});
const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = (record = {}) => {
  // getOptions();
  resetFields();
  currentRecord.value = record;
  visible.value = true;
};
const handleOk = () => {
  validate()
    .then(() => {
      loading.value = true;
      addFormula(toRaw(modelRef))
        .then((res) => {
          if (res.code === 200) {
            proxy.$message.success("新增成功");
            emit("reset");
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          close();
        });
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const handleCancel = () => {
  close();
};
const close = () => {
  visible.value = false;
  loading.value = false;
};
defineExpose({
  handleOk,
  handleCancel,
  open,
});
</script>
<style lang=""></style>
