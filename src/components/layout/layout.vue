<template>
  <div class="container">
    <ConfigProvider
      :locale="locale"
      :transformCellText="transformCellText"
      :space="space"
    >
      <!-- 全局配置，中文 -->
      <!-- <Spin size="large" :spinning="spinning" tip="处理中，请稍后..."> -->
      <Layout>
        <MyLayoutHeader></MyLayoutHeader>
        <MyLayoutContent></MyLayoutContent>
      </Layout>
      <!-- </Spin> -->
    </ConfigProvider>
  </div>
</template>
<script setup>
import { Layout } from "ant-design-vue";
import MyLayoutHeader from "./MyLayoutHeader.vue";
import MyLayoutContent from "./MyLayoutContent.vue";
import { ConfigProvider, Spin } from "ant-design-vue";
import { ref } from "vue";
import zhCN from "ant-design-vue/es/locale/zh_CN";
const locale = ref(zhCN);

const spinning = ref(false);

const transformCellText = ({ text, column, record, index }) => {
  // if (text === "true") {
  //   return "是";
  // } else if (text === "false") {
  //   return "否";
  // } else if (text == 0) {
  //   return "未使用";
  // } else if (text == 1) {
  //   return "使用中";
  // } else {
  //   return text;
  // }
  return text;
};

const space = {
  size: 8,
};
</script>
<style scoped>
.container {
  height: 100vh;
  width: 100vw;
}
.ant-layout {
  height: 100%;
}
</style>
