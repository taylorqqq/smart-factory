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
            <Button type="primary" size="small" @click="handleDetail(record)">
              详情</Button
            >
            <Button
              type="warning"
              size="small"
              @click="
                handleExportXls('产品瑕疵检测报告-' + timestamp, {
                  id: record.id,
                })
              "
              >导出</Button
            >
            <!-- :loading="exportLoading" -->
          </Space>
        </template>
      </template>
    </Table>
  </Modal>
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
import {
  ref,
  getCurrentInstance,
  defineComponent,
  reactive,
  toRaw,
  computed,
} from "vue";
import useTable from "@/hooks/useTable";
import request from "@/services";

const { Option } = Select;

const { emit, proxy } = getCurrentInstance();

const width = "80%";
const title = "历史记录";
const visible = ref(false);
const exportLoading = ref(false);
const currentRecord = ref({});

//获取一个响应式的时间戳
let timestamp = ref(Date.now());
setInterval(() => {
  timestamp.value = Date.now();
}, 1000);

const queryParam = ref({});

const sticky = {
  offsetHeader: 0,
  offsetScroll: 0,
  getContainer: () => document.querySelector(".ant-modal-body"),
};
// 母卷号 检查员 开始时间 缺陷数量 配方
const columns = ref([
  {
    title: "母卷号",
    dataIndex: "masterRoolTitle",
    key: "masterRoolTitle",
    ellipsis: true,
  },
  {
    title: "检查员",
    dataIndex: "checkUserName",
    key: "checkUserName",
    ellipsis: true,
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    key: "startTime",
    ellipsis: true,
  },
  {
    title: "缺陷数量",
    dataIndex: "defectAmount",
    key: "defectAmount",
    ellipsis: true,
  },
  {
    title: "配方",
    dataIndex: "formulaTitle",
    key: "formulaTitle",
    ellipsis: true,
  },
  {
    title: "操作",
    key: "operation",
  },
]);

const url = ref({
  list: "/masterRollCheckRecord/list",
  exportXlsUrl: "/masterRollCheckRecord/downCheckRecord",
});

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
} = useTable(url);

const open = (record = {}) => {
  const { masterRollTitle, checkUserName, startTime, endTime, team } = record;
  queryParam.value = {
    masterRollTitle,
    checkUserName,
    startTime,
    endTime,
    team,
  };
  loadData(1, queryParam.value);
  currentRecord.value = record;
  visible.value = true;
};
const handleOk = () => {
  close();
};

const handleDetail = (record) => {
  emit("detail", record);
  close();
};

const handleExportXls = (fileName, params) => {
  if (exportLoading.value) {
    proxy.$message.warning("其他文件正在导出，请稍后再试！");
    return false;
  }
  if (!url.value.exportXlsUrl) {
    proxy.$message.warning("导出地址未配置！");
    return false;
  }
  let exportXlsUrl = url.value.exportXlsUrl;

  exportLoading.value = true;
  if (!fileName || typeof fileName != "string") {
    fileName = "导出文件";
  }
  let param = { ...params };
  request.downFile(exportXlsUrl, param).then((data) => {
    if (!data) {
      proxy.$message.warning("文件下载失败！");
      exportLoading.value = false;
      return;
    }
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      window.navigator.msSaveBlob(
        new Blob([data], { type: "application/vnd.ms-excel" }),
        fileName + ".xls"
      );
      exportLoading.value = false;
    } else {
      let url = window.URL.createObjectURL(
        new Blob([data], { type: "application/vnd.ms-excel" })
      );
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", fileName + ".xls");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); //下载完成移除元素
      window.URL.revokeObjectURL(url); //释放掉blob对象
      exportLoading.value = false;
    }
  });
};

const handleCancel = () => {
  emit("close");
  close();
};
const close = () => {
  visible.value = false;
  exportLoading.value = false;
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
