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
    <!-- 操作 -->
    <div class="action">
      <Button type="primary" @click="handleAdd" v-if="userInfo?.userType == 0">
        新增
        <template #icon><PlusOutlined /></template>
      </Button>
    </div>
    <Table
      :loading="loading"
      :dataSource="dataSource"
      :columns="columns"
      :pagination="ipagination"
      size="small"
      :sticky="sticky"
    >
      <template #bodyCell="{ text, record, index, column }">
        <template v-if="column.key === 'operation'">
          <Space>
            <Button
              type="success"
              size="small"
              @click="handleDeal(record, 1)"
              :disabled="recordDisabled(record.status, 0)"
            >
              启用</Button
            >
            <Button
              type="primary"
              size="small"
              @click="handleDeal(record, 2)"
              :disabled="record.status == 0"
            >
              编辑</Button
            >
            <Button
              type="danger"
              size="small"
              @click="handleDeal(record, 3)"
              :disabled="recordDisabled(record.status, 0)"
            >
              删除</Button
            >
            <Button
              type="warning"
              size="small"
              :disabled="recordDisabled(record.status, 1)"
              @click="handleDeal(record, 4)"
              >停用</Button
            >
          </Space>
        </template>
      </template>
    </Table>
  </Modal>

  <AddFormulaModal ref="add" @reset="okCallBack"></AddFormulaModal>
  <EditFormulaModal ref="edit" @reset="okCallBack"></EditFormulaModal>
</template>
<script setup>
import {
  Modal,
  Button,
  Table,
  Spin,
  Input,
  Select,
  Tag,
  Space,
} from "ant-design-vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import {
  ref,
  getCurrentInstance,
  defineComponent,
  reactive,
  toRaw,
  computed,
} from "vue";
import AddFormulaModal from "./AddFormulaModal.vue";
import EditFormulaModal from "./EditFormulaModal.vue";
import useTable from "@/hooks/useTable";
import { switchFormula, deleteFormula } from "@/api/api";
import { useUserStore } from "@/store/user";

const { Option } = Select;

const { emit, proxy } = getCurrentInstance();

const { userInfo } = useUserStore();

const recordDisabled = (status, key) => {
  let dis = false;
  if (userInfo?.userType == 0) {
    dis = false;
    if (status == key) {
      dis = true;
    }
  } else {
    dis = true;
  }
  return dis;
};

const width = "60%";
const title = "配方列表";
const visible = ref(false);
const currentRecord = ref({});
const sticky = {
  offsetHeader: 0,
  offsetScroll: 0,
  getContainer: () => document.querySelector(".ant-modal-body"),
};

const url = ref({
  list: "/formula/list",
});

const add = ref(null);
const edit = ref(null);

const {
  dataSource,
  ipagination,
  loadData,
  searchQuery,
  loading,
  selectedRowKeys,
  selectionRows,
  superQueryParams,
  isorter,
  filters,
  queryParam,
} = useTable(url);
// 母卷号 检查员 开始时间 缺陷数量 配方
const columns = ref([
  {
    title: "配方名称",
    dataIndex: "recipe",
    key: "recipe",
    ellipsis: true,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    ellipsis: true,
    customRender: ({ text }) => {
      let textStr = "未使用";
      if (text == 0) {
        textStr = "使用中";
      }
      return textStr;
    },
  },
  {
    title: "操作",
    key: "operation",
  },
]);

const open = (record = {}) => {
  loadData(1);
  currentRecord.value = record;
  visible.value = true;
};

const handleAdd = () => {
  add.value.open();
};

const handleOk = () => {
  close();
};

const handleDeal = (record, type) => {
  // emit("detail", record);
  const { id, status } = record;
  switch (type) {
    // 启用
    case 1:
      switchFormula({ id, status }).then((res) => {
        if (res.code == 200) {
          proxy.$message.success("启用成功");
          loadData(1);
        }
      });
      break;
    // 编辑
    case 2:
      edit.value.open(record);
      break;
    // 删除
    case 3:
      deleteFormula({ id }).then((res) => {
        if (res.code == 200) {
          proxy.$message.success("删除成功");
          loadData(1);
        }
      });
      break;
    // 停用
    case 4:
      switchFormula({ id, status }).then((res) => {
        if (res.code == 200) {
          proxy.$message.success("停用成功");
          loadData(1);
        }
      });
      break;
  }
};

const handleCancel = () => {
  emit("close");
  close();
};

const close = () => {
  visible.value = false;
};

const okCallBack = () => {
  loadData(1);
};

defineExpose({
  handleOk,
  handleCancel,
  open,
});
</script>
<style lang="less" scoped>
@import "@/assets/style/global.less";
</style>
