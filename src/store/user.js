import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { login, logout } from "@/api/login";
import { setToken, removeToken } from "@/utils/auth";

export const useUserStore = defineStore(
  "user",
  () => {
    const userInfo = ref({});
    const userLogin = (params) => {
      return new Promise((resolve, reject) => {
        login(params)
          .then((res) => {
            setToken(res.data.token);
            setUserInfo(res.data.userDO);
            localStorage.setItem("userInfo", JSON.stringify(res.data.userDO));
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };
    const userLoginOut = () => {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            removeToken();
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    const setUserInfo = (info) => {
      userInfo.value = info;
    };

    return { userInfo, userLogin, userLoginOut, setUserInfo };
  },
  {
    enabled: true,
  }
);
