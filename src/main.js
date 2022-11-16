import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import { message, notification } from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import axios from "./services";
import router from "./router";
import piniaPersist from "pinia-plugin-persist";

import "./mock/mock";

import "@/utils/permission";

import "./assets/main.css";

const app = createApp(App);

app.config.globalProperties.$message = message;
app.config.globalProperties.$notification = notification;
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$router = router;

const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);
app.use(router);
app.mount("#app");
