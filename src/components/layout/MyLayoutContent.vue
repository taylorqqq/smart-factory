<template>
  <LayoutContent class="content-wrap">
    <IconographyDetection class="content-iconography"></IconographyDetection>
    <FormDetection class="content-form"></FormDetection>
    <CurrentMsg class="content-msg"></CurrentMsg>
  </LayoutContent>
</template>
<script setup>
import { Layout } from "ant-design-vue";
import IconographyDetection from "../modules/iconographyDetection.vue";
import FormDetection from "../modules/FormDetection.vue";
import CurrentMsg from "../modules/CurrentMsg.vue";

const LayoutContent = Layout.Content;
</script>
<style scoped lang="less">
.ant-layout-content {
  background: #fff;
  padding: 10px 20px;
  margin: 0;
  min-height: 280px;
  color: #000;
}
.content-wrap {
  display: flex;
  justify-content: space-between;
  // overflow: hidden;
  // overflow-y: auto;

  .content-msg,
  .content-iconography {
    flex: 1;
    overflow-y: auto;

    // // 滚动条样式
    // &::-webkit-scrollbar {
    //   display: none;
    // }

    display: flex;
    justify-content: start;
  }

  .content-form {
    flex: 2;
  }
}
</style>
