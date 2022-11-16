<script setup>
import { RouterLink, RouterView } from "vue-router";

//监听resize事件
window.addEventListener("resize", () => {
  window.location.reload();
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
