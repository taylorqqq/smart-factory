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
        <Button
          @click="handleOk"
          :loading="loading"
          v-if="userInfo?.userType == 0"
        >
          保存
        </Button>
        <Button @click="handleCancel">取消</Button>
      </div>
    </template>
    <Spin :spinning="loading">
      <Form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :scrollToFirstError="true"
        preserve="false"
        :model="modelRef"
      >
        <Row>
          <Col :span="12">
            <div class="label title">缺陷类型</div>
          </Col>
          <Col :span="12">
            <div class="label title">预警数量</div>
          </Col>
        </Row>
        <Row v-for="(item, index) in newFormulaItemList" :key="item.id">
          <Col :span="12">
            <div class="label">{{ item.label }}</div>
          </Col>
          <Col :span="12">
            <FormItem v-bind="validateInfos[`amount${item.id}`]">
              <Input
                type="number"
                v-model:value="modelRef[`amount${item.id}`]"
                :min="min"
              >
              </Input>
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
  Form,
  Spin,
  Input,
  Select,
  Row,
  Col,
  Button,
} from "ant-design-vue";
import { ref, getCurrentInstance, defineComponent, reactive, toRaw } from "vue";
import { FormulaItemList } from "@/utils/enterForm";
import { updateDetail, getFormulaDetail } from "@/api/api";
import { useUserStore } from "@/store/user";

const FormItem = Form.Item;
const { Option } = Select;
const useForm = Form.useForm;
const min = 0;

const { userInfo } = useUserStore();

const { proxy, emit } = getCurrentInstance();

const formulaList = ref([]);

let newFormulaItemList = ref(
  FormulaItemList.map((item) => {
    return reactive(item);
  })
);

let modelRef = reactive(
  FormulaItemList.reduce((prev, cur) => {
    prev[`amount${cur.id}`] = 0;
    return prev;
  }, {})
);

const rulesRef = reactive(
  FormulaItemList.reduce((acc, cur) => {
    acc[`amount${cur.id}`] = [
      {
        required: cur.required,
        message: `请输入预警数量`,
      },
    ];
    return acc;
  }, {})
);

const width = "500px";
const title = "编辑配方";
const visible = ref(false);
const currentRecord = ref({});
const labelCol = { span: 5 };
const wrapperCol = { span: 24 };
const loading = ref(false);

const { resetFields, validate, validateInfos } = useForm(modelRef, rulesRef);

const open = (record = {}) => {
  resetFields();
  currentRecord.value = record;
  loadFormulaList(record.id);
  visible.value = true;
};
const handleOk = () => {
  validate()
    .then(() => {
      loading.value = true;
      const data = toRaw(modelRef);
      const itemInfoList = [];
      for (let key in data) {
        itemInfoList.push({
          type: key.replace("amount", ""),
          amount: data[key],
        });
      }
      const formData = Object.assign({}, currentRecord.value, {
        itemInfoList,
      });
      updateDetail(formData)
        .then((res) => {
          emit("reset");
          proxy.$message.success("修改成功");
        })
        .catch((err) => {})
        .finally(() => {
          loading.value = false;
          close();
        });
    })
    .catch((err) => {
      console.log("error", err);
    });
};

const loadFormulaList = (id) => {
  getFormulaDetail({ id })
    .then((res) => {
      const { itemInfoList } = res.data;
      itemInfoList.forEach((item) => {
        modelRef[`amount${item.type}`] = item.amount;
      });
    })
    .catch((err) => {})
    .finally(() => {});
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
.label {
  text-align: center;
  line-height: 32px;
  padding-right: 10px;
}
.title {
  font-weight: bold;
  margin-bottom: 24px;
  font-size: 16px;
}
</style>
