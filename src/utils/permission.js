import router from "@/router";
import { useUserStore } from "@/store/user";
import { useSystemStore } from "@/store/system";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { getToken } from "@/utils/auth";
// import { getCurrentInstance } from "vue";
NProgress.configure({ showSpinner: false }); // 进度环显示/隐藏
// const { proxy } = getCurrentInstance();

// 白名单路由
const whiteList = ["/login"];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  const { userInfo, setUserInfo } = useUserStore();
  const { sysInfo, setSysInfo } = useSystemStore();
  let token = getToken();
  if (token) {
    // 登录成功，跳转到首页
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      // 获取用户信息
      let currentUserInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
      // 获取其他系统信息
      let currentSysInfo = JSON.parse(localStorage.getItem("sysInfo")) || {};
      if (!userInfo?.userName) {
        setUserInfo(currentUserInfo);
      }

      setSysInfo(currentSysInfo);

      const hasUserInfo = userInfo?.userName || currentUserInfo?.userName;

      if (hasUserInfo) {
        next();
      } else {
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    }
  } else {
    // 未登录可以访问白名单页面(登录页面)
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});
