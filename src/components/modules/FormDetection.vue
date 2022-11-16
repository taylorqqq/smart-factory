<template>
  <div class="my-content">
    <div class="card-wrap">
      <div class="card-box">
        <div
          class="card-item"
          v-for="(item, index) in dataSource"
          :key="item.id"
          @click="handleScroll(item.id, index)"
        >
          <div class="card-item-header">
            <Space>
              <span>{{ item.transverse }}</span>
              <span>,</span>
              <span>{{ item.portrait }}</span>
            </Space>
          </div>
          <div class="card-item-body">
            <!-- <Image :src="item.img" :fallback="fallback" :preview="false" /> -->
            <img :src="item.img" alt="暂无图片" />
          </div>
          <div class="card-item-footer">
            <span>{{ index + 1 }}</span>
            <span>{{ item.typeTitle }}：{{ item.area }}mm2</span>
          </div>
        </div>
      </div>
    </div>
    <Divider />
    <div class="form-wrap">
      <Table
        :loading="loading"
        :dataSource="dataSource"
        :columns="columns"
        :pagination="false"
        size="small"
        :rowClassName="rowClassName"
        :sticky="sticky"
      >
      </Table>
    </div>
  </div>
</template>

<script setup>
import { Space, Table, Divider, Image } from "ant-design-vue";
import { reactive, toRefs, ref, onMounted } from "vue";
import useTable from "@/hooks/useTable";
import { useSystemStore } from "@/store/system";

const { setWatchFlaw } = useSystemStore();

const currentRecord = ref({});

const queryParam = ref({});

const sticky = {
  offsetHeader: 0,
  offsetScroll: 0,
  getContainer: () => document.querySelector(".ant-modal-body"),
};

const fallback =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const rowClassName = (record, index) => {
  //   if (record.id === currentRecord.value.id) {
  //     return "my-row-active";
  //   }
  return `my-row-${record.id}`;
};

//点击卡片 自动滚动到指定行，同时修改高亮颜色功能
const handleScroll = (id, index) => {
  // 清除之前的高亮
  let dom = document.getElementsByClassName(`my-row-${id}`)[0];
  dom.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
  currentRecord.value = dataSource.value.find((item) => item.id === id);
  setTimeout(() => {
    let domList = document.getElementsByClassName("ant-table-row");
    //  遍历  HTMLCollection
    // activeDomList转换为数组
    Array.from(domList).forEach((item, indexKey) => {
      item.classList.remove("my-row-active");
      item.style.backgroundColor = "";
      item.style.color = "#000";
      if (indexKey === index) {
        item.classList.add("my-row-active");
      }
    });
    setTimeout(() => {
      let activeDom = document.getElementsByClassName("my-row-active")[0];
      activeDom.style.backgroundColor = "red";
      activeDom.style.color = "#fff";

      setWatchFlaw(dataSource.value[index]);
    }, 0);
  }, 0);
};

const url = ref({
  list: "/defectRecord/list",
});

const columns = ref([
  {
    title: "序号",
    customRender: ({ text, record, index }) => index + 1,
  },
  {
    title: "横坐标",
    dataIndex: "portrait",
    key: "portrait",
    ellipsis: true,
  },
  {
    title: "纵坐标",
    dataIndex: "transverse",
    key: "transverse",
    ellipsis: true,
  },
  {
    title: "类别",
    dataIndex: "typeTitle",
    key: "typeTitle",
    ellipsis: true,
  },
  {
    title: "面积",
    dataIndex: "area",
    key: "area",
    ellipsis: true,
  },
  {
    title: "时间",
    dataIndex: "gmtCreate",
    key: "gmtCreate",
    ellipsis: true,
    width: 200,
  },
]);

const {
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
} = useTable(url);

onMounted(() => {
  // loadFlawMsg();
  loadData(1, queryParam.value);
});
</script>

<style lang="less" scoped>
.my-content {
  display: flex;
  flex-direction: column;

  .my-row-active {
    background-color: red;
  }

  .card-wrap {
    // flex: 7;
    flex: 1;
    overflow-y: auto;
    // 滚动条样式隐藏
    &::-webkit-scrollbar {
      display: none;
    }
    .card-box {
      display: flex;
      //   justify-content: space-between;
      flex-wrap: wrap;
      .card-item {
        width: 32%;
        height: 205px;
        margin: 0.5%;
        border: 1px solid #ccc;
        transition: 0.5s;
        display: flex;
        flex-direction: column;
        .card-item-header {
          display: flex;
          //   justify-content: space-between;
          padding: 10px;
          height: 40px;
          line-height: 20px;
          border-bottom: 1px solid #ccc;
        }
        .card-item-body {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 2px;
          height: calc(100% - 80px);
          //   flex: 1;
          img {
            width: 100%;
            height: 100%;
            // object-fit: contain; // 图片自适应
          }
        }
        .card-item-footer {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          height: 40px;
          line-height: 20px;
          border-top: 1px solid #ccc;
        }

        // 3的倍数的card-item 无右边框
        // &:nth-child(3n) {
        //   border-right: none;
        // }

        &:hover {
          box-shadow: 5px 5px 10px #e8e8e8;
        }
      }
    }
  }
  .form-wrap {
    // flex: 2;
    height: 200px !important;
    overflow-y: auto;
    // 滚动条样式隐藏
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
