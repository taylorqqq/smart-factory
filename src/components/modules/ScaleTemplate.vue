<template>
  <div class="scale-wrap">
    <Space class="scale-space">
      <PlusSquareOutlined :style="scaleStyle"></PlusSquareOutlined>
      <MinusSquareOutlined :style="scaleStyle"></MinusSquareOutlined>
      <FullscreenOutlined :style="scaleStyle"></FullscreenOutlined>
      <FullscreenExitOutlined :style="scaleStyle"></FullscreenExitOutlined>
    </Space>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons-vue";
import { Space } from "ant-design-vue";

const scaleStyle = ref({
  fontSize: "20px",
  color: "#000",
  cursor: "pointer",
  margin: "0 10px",
});
</script>

<style lang="less" scoped>
.scale-wrap {
  flex: 1;
}
.scale-space {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
