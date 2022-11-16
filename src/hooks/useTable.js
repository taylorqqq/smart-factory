import { ref, onMounted, reactive, getCurrentInstance } from "vue";
import { filterObj } from "@/utils/utils";
import request from "@/services";
const useTbale = (props) => {
  const url = props.value.list;
  const { proxy } = getCurrentInstance();
  const dataSource = ref([]);
  const isorter = ref({
    column: "id",
    order: "desc",
  });
  /* 筛选参数 */
  const filters = ref({});
  const ipagination = reactive({
    current: 1,
    pageSize: 15,
    pageSizeOptions: [
      "15",
      "20",
      "25",
      "30",
      "35",
      "40",
      "45",
      "50",
      "60",
      "100",
    ],
    showTotal: (total, range) => {
      return range[0] + "-" + range[1] + " 共" + total + "条";
    },
    showQuickJumper: true,
    showSizeChanger: true,
    total: 0,
  });
  const loading = ref(false);
  const selectedRowKeys = ref([]);
  const selectionRows = ref([]);
  const superQueryParams = ref({});

  const searchQuery = (params) => {
    loadData(1, params);
  };

  const loadData = (arg, params = {}) => {
    if (!url) {
      proxy.$message.error("请设置url.list属性!");
      return;
    }
    if (arg === 1) {
      ipagination.current = 1;
    }

    let newParams = getQueryParams(params); //查询条件
    console.log("newParams", newParams);

    loading.value = true;
    request.get(url, newParams).then((res) => {
      if (res.code === 200) {
        dataSource.value = res.data;
        ipagination.total = res.data.length;
      }
      if (res.code === 510) {
        proxy.$message.warning(res.data);
      }
      loading.value = false;
    });
    selectedRowKeys.value = [];
    selectionRows.value = [];
  };

  const getQueryParams = (params) => {
    //获取查询条件
    let queryParam = { ...params };
    let sqp = {};
    let searchObj = {};
    queryParam.order = isorter.value.column + " " + isorter.value.order;
    searchObj.search = JSON.stringify(queryParam);
    let param = Object.assign(sqp, searchObj, filters.value);
    param.currentPage = ipagination.current;
    param.pageSize = ipagination.pageSize;
    return filterObj(param);
  };

  return {
    dataSource,
    ipagination,
    loadData,
    searchQuery,
    loading,
    selectedRowKeys,
    selectionRows,
    superQueryParams,
    isorter,
    filters,
  };
};

export default useTbale;
