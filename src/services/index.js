import axios from "axios";
import qs from "qs";
import { Modal, notification } from "ant-design-vue";
// import store from "@/store"; //vuex
import router from "@/router";
import { getToken, setToken, removeToken } from "@/utils/auth";

axios.defaults.baseURL = "/smart"; //测试

//设置超时
axios.defaults.timeout = 600000;

axios.interceptors.request.use(
  (config) => {
    let token = getToken();
    if (token) {
      config.headers["Authorization"] = token; // 让每个请求携带自定义 token 请根据实际情况自行修改
    }
    if (config.data && config.data.tenantId) {
      config.headers["tenantId"] = config.data.tenantId;
    }
    if (config.method == "get") {
      config.params = {
        _t: Date.parse(new Date()) / 1000,
        ...config.params,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    if (response && response.status == 200) {
      const data = response.data;
      // 判断是不是blob类型
      if (data instanceof Blob) {
        return data;
      }
      if (data.code == 401) {
        //登录过期,权限不足
        let message = data.message;
        if (!message) {
          message = "登陆过期";
        }
        notification.error({
          message: "错误",
          description: message,
        });
        //清除token
        removeToken();
        // store.commit("logout");
        router.replace({
          path: "/login",
        });
      } else if (data.code != 200) {
        let message = "业务异常，请联系管理员";
        if (data.message) {
          message = data.message;
        }
        notification.error({
          message: "错误",
          description: message,
        });

        return Promise.reject({ errno: 500, errmsg: message });
      } else {
        return Promise.resolve(data);
      }
    } else {
      return Promise.reject(response);
    }
  },
  (error) => {
    if (error.response.status == 401) {
      //登录过期,权限不足
      notification.error({
        message: "错误",
        description: "登陆过期",
      });

      //清除token
      removeToken();
      // store.commit("logout");
      router.replace({
        path: "/login",
      });
    } else {
      // console.warn(error);
      notification.error({
        message: "错误",
        description: "连接超时,请稍后再试!",
      });

      return Promise.reject({ errno: 500, errmsg: "连接超时,请联系客服" });
    }
  }
);
export default {
  /**
   * @param {String} url
   * @param {Object} data
   * @returns Promise
   */
  post(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "post",
        url,
        // data: qs.stringify(data),
        data: data,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  get(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url,
        params: data,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  delete(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "delete",
        url,
        params: data,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  put(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "put",
        url,
        data: data,
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  downFile(url, data) {
    return new Promise((resolve, reject) => {
      axios({
        method: "get",
        url,
        params: data,
        responseType: "blob",
      })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
