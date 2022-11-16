import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
const path = require("path");
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      vue: "vue/dist/vue.esm-bundler.js", // 定义vue的别名，如果使用其他的插件，可能会用到别名，该配置同时解决ant-design-vue中单页递归生成导航菜单时会出现异常的问题
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        charset: false,
        additionalData: '@import "./src/assets/style/global.less";',
      },
    },
  },
  hmr: true, // 开启热更新
  strictPort: true, // 端口占用时，自动分配一个未被占用的端口
  server: {
    // port: 19958,
    open: true,
    // host: "127.0.0.1",
    proxy: {
      "/smart": {
        target: "http://47.243.248.45:19999", // 测试环境
        // target: "http://192.168.1.102:9996", // 请求本地
        changeOrigin: true,
      },
    },
  },
});
