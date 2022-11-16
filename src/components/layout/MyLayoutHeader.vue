<template>
  <LayoutHeader>
    <div class="sys-wrap">
      <span class="sys-title">{{ sysInfo.systemTitle }}</span>
      <span class="machine-type"
        >{{ userInfo.userType == 0 ? "检测机" : "观察机"
        }}{{ userInfo.version }}</span
      >
    </div>
    <div class="sys-action">
      <Button
        type="primary"
        @click="handleStart"
        :loading="startLoading"
        :disabled="sysInfo?.disabled"
        v-if="userInfo?.userType == 0 && isHistory"
      >
        开始检测
        <template #icon><RedoOutlined /></template>
      </Button>
      <Button
        type="danger"
        @click="handleFinish"
        :loading="endLoading"
        :disabled="!sysInfo?.disabled"
        v-if="userInfo?.userType == 0 && isHistory"
      >
        停止检测
        <template #icon><UndoOutlined /></template>
      </Button>
      <Button type="success" @click="handleFormula" v-if="isHistory">
        配&emsp;&emsp;方
        <template #icon><PlusSquareOutlined /></template>
      </Button>
    </div>
    <div class="sys-info-action">
      <Button
        type="search"
        size="small"
        @click="handleHistory"
        v-if="isHistory"
      >
        历史查询
        <template #icon><SearchOutlined /></template>
      </Button>
      <Button type="search" size="small" v-else @click="handleExitHistory">
        退出历史查询
        <template #icon><SearchOutlined /></template>
      </Button>
      <Button
        type="edit"
        size="small"
        @click="handleEnter"
        v-if="userInfo?.userType == 0 && isHistory"
      >
        信息录入
        <template #icon><FormOutlined /></template>
      </Button>
    </div>
    <div class="sys-info-action">
      <span>你好,{{ userInfo.userName }}!</span>
      <Button type="update" size="small" @click="handleUpUser">
        账户修改
        <template #icon><SettingOutlined /></template>
      </Button>
    </div>
    <div class="sys-info-action">
      <Button type="warning" @click="handleExit">
        退出系统
        <template #icon><LoginOutlined /></template>
      </Button>
      <img :src="generateImg('PNTOO')" alt="" />
    </div>
  </LayoutHeader>

  <UpdataUserModal ref="updateUser"></UpdataUserModal>
  <HistoryModal
    ref="history"
    @close="changeHistory"
    @detail="handleModelHistory"
  ></HistoryModal>
  <EnterModal ref="enter"></EnterModal>
  <FormulaModal ref="formula"></FormulaModal>
</template>
<script setup>
import { Layout, Button } from "ant-design-vue";
import {
  RedoOutlined,
  UndoOutlined,
  PlusSquareOutlined,
  SettingOutlined,
  SearchOutlined,
  FormOutlined,
  LoginOutlined,
} from "@ant-design/icons-vue";
import { useSystemStore } from "@/store/system";
import { useUserStore } from "@/store/user";
import UpdataUserModal from "@/components/modules/updataUserModal.vue";
import HistoryModal from "@/components/modules/HistoryModal.vue";
import EnterModal from "@/components/modules/EnterModal.vue";
import FormulaModal from "@/components/modules/FormulaModal.vue";
import { ref, getCurrentInstance } from "vue";
import { startCheck, endCheck } from "@/api/api";

const LayoutHeader = Layout.Header;

const { sysInfo, setSysInfo } = useSystemStore();
const { userInfo, userLoginOut } = useUserStore();

const { proxy } = getCurrentInstance();

const updateUser = ref(null);
const history = ref(null);
const enter = ref(null);
const formula = ref(null);

const startLoading = ref(false);
const endLoading = ref(false);

const isHistory = ref(true);
// 根据文字生成图片
const generateImg = (text) => {
  // 白色背景 蓝色文字 宽度自适应 高度50px
  return `https://img.shields.io/badge/${text}-blue?style=for-the-badge&logo=appveyor&color=blue`;
};

const handleStart = () => {
  startCheck()
    .then((res) => {
      startLoading.value = true;
      if (res.code === 200) {
        proxy.$message.success("开始检测");
        setSysInfo({ disabled: true });
        localStorage.setItem("sysInfo", JSON.stringify({ disabled: true }));
      } else {
        proxy.$message.error("开始检测失败");
      }
    })
    .catch((err) => {
      console.log(err);
      proxy.$message.error("开始检测失败");
    })
    .finally(() => {
      startLoading.value = false;
    });
};

const handleFinish = () => {
  endCheck()
    .then((res) => {
      endLoading.value = true;
      if (res.code === 200) {
        proxy.$message.success("停止检测");
        setSysInfo({ disabled: false });
        localStorage.setItem("sysInfo", JSON.stringify({ disabled: false }));
      } else {
        proxy.$message.error("停止检测失败");
      }
    })
    .catch((err) => {
      console.log(err);
      proxy.$message.error("停止检测失败");
    })
    .finally(() => {
      endLoading.value = false;
    });
};

const handleFormula = () => {
  formula.value.open();
};

const handleUpUser = () => {
  updateUser.value.open();
};

const handleHistory = () => {
  history.value.open();
  changeHistory();
};

const handleExitHistory = () => {
  changeHistory();
  proxy.$message.info("退出历史查询模式");
};

const handleEnter = () => {
  enter.value.open();
};

const handleModelHistory = (data) => {
  proxy.$message.info("历史查询模式");
};

const changeHistory = () => {
  isHistory.value = !isHistory.value;
};

const handleExit = () => {
  userLoginOut().then((res) => {
    if (res.code === 200) {
      proxy.$router.push("/login");
    }
  });
};
</script>
<style scoped lang="less">
.ant-layout-header {
  color: #fff;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .sys-wrap {
    height: 100%;
    flex: 3;

    .sys-title {
      font-size: @TitleSize;
      font-weight: 700;
      margin-right: 20px;
    }
    .machine-type {
      font-size: @MachineSize;
      font-weight: 700;
    }
  }
  .sys-action {
    height: 100%;
    flex: 3;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .sys-info-action {
    height: 100%;
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
