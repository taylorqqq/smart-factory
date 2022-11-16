import { createRouter, createWebHashHistory } from "vue-router";
import Instrument from "@/views/Instrument/Instrument.vue";
import Login from "@/views/Login/Login.vue";

const routes = [
  {
    path: "/",
    name: "instrument",
    component: Instrument,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
