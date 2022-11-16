import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";

export const useSystemStore = defineStore(
  "system",
  () => {
    // 持久化
    persist: true;
    const formLabelRequireList = ref([]);
    let sysInfo = reactive({
      systemTitle: "带钢孔洞检测仪",
      disabled: false,
    });

    const setSysInfo = (info) => {
      sysInfo = Object.assign(sysInfo, info);
    };

    // 响应式字符串 watchFlaw
    const watchFlaw = reactive({
      flaw: null,
    });

    const setFormLabelRequireList = (list) => {
      formLabelRequireList.value = list;
      localStorage.setItem("formLabelRequireList", JSON.stringify(list));
    };

    const setWatchFlaw = (value) => {
      watchFlaw.flaw = value;
    };

    return {
      formLabelRequireList,
      setFormLabelRequireList,
      watchFlaw,
      setWatchFlaw,
      sysInfo,
      setSysInfo,
    };
  },
  {
    enabled: true,
  }
);
