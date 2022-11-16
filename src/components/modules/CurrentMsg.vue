<template>
  <div class="my-current">
    <div class="resource-wrap">
      <div class="image-wrap">
        <div class="image-item">
          <img
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            alt="暂无数据"
            ref="wrapper"
          />
          <!-- <Image :src="fallback" :fallback="fallback" :preview="false" /> -->
        </div>
      </div>
      <div class="action-wrap">
        <div class="action-Scale">
          <Space>
            <Button size="small" type="primary" @click="handleScale(1)"
              >1x</Button
            >
            <Button size="small" type="primary" @click="handleScale(2)"
              >2x</Button
            >
            <Button size="small" type="primary" @click="handleScale(3)"
              >3x</Button
            >
          </Space>
          <Space class="my-space">
            <Button
              size="small"
              type="primary"
              @click="handleAlarm(0)"
              :disabled="sliderValue == 0"
              >暂停报警</Button
            >
            <!-- <div class="my-slider"> -->
            <Slider
              v-model:value="sliderValue"
              :min="min"
              :max="max"
              @change="handleAlarm(1)"
            />
            <BellOutlined :style="{ color: nextColor }" />
            <!-- </div> -->
          </Space>
        </div>
      </div>
    </div>
    <Divider />
    <div class="form-wrap">
      <Form
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :scrollToFirstError="true"
        preserve="false"
        :model="modelRef"
      >
        <Row>
          <Col span="12" v-for="item in newFormLabelRequireList" :key="item.id">
            <FormItem :label="item.label" v-if="item.show">
              <Input v-model:value="modelRef[item.key]"> </Input>
            </FormItem>
          </Col>
          <Col :span="newFormLabelRequireList.length % 2 == 1 ? '12' : '24'">
            <SettingOutlined
              :style="{
                fontSize: '26px',
                color: '#1890ff',
                height: '32px',
                float: 'right',
                margin: '0 20px',
              }"
              @click="handleSetting(modelRef)"
            />
          </Col>
        </Row>
      </Form>
    </div>
    <Divider class="my-divider" />
    <div class="statistics-wrap">
      <Card size="small">
        <template #title
          ><Space><CalendarOutlined /><span>缺陷统计</span> </Space></template
        >
        <div
          v-for="(item, index) in flawStatisticList"
          :key="index"
          class="statistics-item"
        >
          <label>{{ item.name }}</label>
          <Progress
            stroke-linecap="square"
            :percent="item.value"
            :format="(percent) => `${percent}`"
          />
        </div>
        <div class="total statistics-item">
          <label>合计：</label>
          <Progress
            stroke-linecap="square"
            :percent="total"
            :format="(percent) => `${percent}`"
          />
        </div>
      </Card>
    </div>
    <CurrentSettingModal
      ref="setting"
      @callBack="okCallBack"
    ></CurrentSettingModal>
  </div>
</template>

<script setup>
import CurrentSettingModal from "./CurrentSettingModal.vue";
import {
  Space,
  Image,
  Slider,
  Button,
  Form,
  Spin,
  Input,
  Select,
  Row,
  Col,
  Divider,
  Card,
  Progress,
} from "ant-design-vue";
import lib, {
  BellOutlined,
  CalendarOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
import {
  ref,
  computed,
  reactive,
  getCurrentInstance,
  defineComponent,
  toRaw,
  onMounted,
} from "vue";
import {
  getFlawStatistic,
  stopAlarm,
  startAlarm,
  getAlarmStatus,
  getCurrentMasterRoll,
  getCurrentFormula,
} from "@/api/api";
import moment from "moment";

const FormItem = Form.Item;
const { Option } = Select;
const { Password } = Input;
const useForm = Form.useForm;

const { forceUpdate, proxy } = getCurrentInstance();

let newFormLabelRequireList = ref(
  JSON.parse(localStorage.getItem("formLabelRequireList"))
    .filter((item) => item.show)
    .sort((a, b) => a.sort - b.sort)
    .map((item) => {
      return reactive(item);
    })
);

const sliderValue = ref(0);
const min = ref(0);
const max = ref(100);
const wrapper = ref(null);
const labelCol = { span: 9 };
const wrapperCol = { span: 14 };
const loading = ref(false);

const setting = ref(null);

const flawStatisticList = ref([]);
const total = computed(() => {
  return flawStatisticList.value.reduce((total, item) => {
    return total + item.value;
  }, 0);
});

// 母卷号 最终用户 配方名称 检查员 实时速度 部件名 班组 开始时间 当前时间
const modelRef = reactive({
  currentTime: moment().format("YYYY-MM-DD HH:mm:ss"),
});

// 每一秒更新一次 currentTime
setInterval(() => {
  modelRef.currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
}, 1000);

const fallback =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const nextColor = computed(() => {
  const mid = +((max.value - min.value) / 2).toFixed(5);
  return sliderValue.value >= mid ? "rgba(0, 0, 0, .45)" : "";
});

const handleSetting = (record) => {
  setting.value.open(record);
};

const handleScale = (scale) => {
  // 图片缩放
  wrapper.value.style.transform = `scale(${scale})`;
  // 放大后，图片左上角对齐
  wrapper.value.style.transformOrigin = "left top";
};

const loadFlawStatistic = async () => {
  const res = await getFlawStatistic();
  if (res.code === 200) {
    for (const key in res.data) {
      if (Object.hasOwnProperty.call(res.data, key)) {
        const element = res.data[key];
        const item = {
          name: key,
          value: element,
        };
        flawStatisticList.value.push(item);
      }
    }
  }
};

const loadAlarmStatus = async () => {
  const res = await getAlarmStatus();
  if (res.code == 200) {
    if (res.data == 1) {
      sliderValue.value = 100;
    } else {
      sliderValue.value = 0;
    }
  }
};

const loadCurrentMasterRoll = async () => {
  const res = await getCurrentMasterRoll();
  if (res.code == 200) {
    if (res?.data) {
      // 遍历数据，赋值给modelRef
      let obj = {};
      obj = { ...res.data, ...modelRef };
      for (const key in obj) {
        if (Object.hasOwnProperty.call(res.data, key)) {
          const element = res.data[key];
          modelRef[key] = element;
        }
      }
    }
  }
};

const loadCurrentFormula = async () => {
  const res = await getCurrentFormula();
  if (res.code == 200) {
    if (res?.data) {
      // 遍历数据，赋值给modelRef
      let obj = {};
      obj = { ...res.data, ...modelRef };
      for (const key in obj) {
        if (Object.hasOwnProperty.call(res.data, key)) {
          const element = res.data[key];
          modelRef[key] = element;
        }
      }
    }
  }
};

const handleAlarm = async (val) => {
  if (val == 0) {
    const res = await stopAlarm();
    if (res.code === 200) {
      proxy.$message.success("操作成功");
      sliderValue.value = 0;
    }
  } else {
    startAlarm();
  }
};

const okCallBack = (data) => {
  data.forEach((item) => {
    if (item.show) {
      newFormLabelRequireList.value = data
        .sort((a, b) => a.sort - b.sort)
        .map((item) => {
          return reactive(item);
        });
    }
  });
};

onMounted(() => {
  loadFlawStatistic();
  loadAlarmStatus();
  loadCurrentMasterRoll();
  loadCurrentFormula();
});
</script>

<style lang="less" scoped>
.ant-divider-horizontal {
  margin-top: 0 !important;
}
.my-current {
  display: flex;
  flex-direction: column;
  .resource-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;

    .image-wrap {
      background-color: #fff;
      margin: 10px;
      flex: 1;
      .image-item {
        height: 100%;
        width: 100%;
        // overflow: hidden;
        overflow: auto;
        // &::-webkit-scrollbar {
        //   display: none;
        // }
        img {
          width: 100%;
          height: 100%;
          object-fit: contain; // 图片自适应
          //滚动条
          // overflow: auto;
        }
      }
    }

    .action-wrap {
      // padding: 10px;
      background-color: #fff;
      height: 50px;
      line-height: 50px;

      .action-Scale {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .ant-space {
          width: 100%;

          &:nth-child(1) {
            align-items: center;
            padding: 0 10%;
            justify-content: space-evenly;
          }
        }
        .my-space {
          display: flex;
          :deep .ant-space-item:nth-child(2) {
            flex: 1;

            // .ant-slider {
            //   width: 100%;
            //   display: flex;
            //   flex-wrap: nowrap;
            // }
          }
        }
      }
    }
  }
  .form-wrap {
    flex: 1;
  }
  .statistics-wrap {
    flex: 1;
    padding: 0 10px 10px 10px;
    overflow: hidden;
    // 滚动条隐藏
    ::-webkit-scrollbar {
      display: none;
    }

    .ant-card {
      height: 100%;
      // position: relative;
      // 纵向滚动条
      // overflow: auto;
      .ant-card-head {
        // 固定头部
        position: sticky;
        top: 0;
      }
      :deep .ant-card-body {
        padding: 10px;
        display: flex;
        height: calc(100% - 50px);
        max-height: 200px;
        flex-direction: column;
        justify-content: space-between;
        .total {
          width: 100%;

          label {
            font-size: 14px !important;
            font-weight: bold;
          }
        }
      }
    }

    .statistics-item {
      display: flex;

      label {
        width: 30%;
      }
    }
  }
}
.my-divider {
  @media screen and (max-width: 1600px) {
    margin: 0;
  }
}
</style>
