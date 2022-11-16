<template>
  <div class="iconography">
    <div class="position">
      <div class="position-tr" v-for="it in 4" :key="it">
        <div class="position-td" v-for="item in 4" :key="item"></div>
      </div>
    </div>
  </div>
  <div class="scale-wrap">
    <Space class="scale-space">
      <PlusSquareOutlined
        :style="scaleStyle"
        @click="handleScale(0.5)"
      ></PlusSquareOutlined>
      <MinusSquareOutlined
        :style="scaleStyle"
        @click="handleScale(2)"
      ></MinusSquareOutlined>
      <FullscreenOutlined
        :style="scaleStyle"
        @click="handleToScale(0.25)"
      ></FullscreenOutlined>
      <FullscreenExitOutlined
        :style="scaleStyle"
        @click="handleToScale(1)"
      ></FullscreenExitOutlined>
    </Space>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, watchEffect, watch } from "vue";
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
} from "@ant-design/icons-vue";
import { Space } from "ant-design-vue";
import { useSystemStore } from "@/store/system";
const { watchFlaw } = useSystemStore();

// watchFlaw 变成响应式
// const watchFlawRef = ref(watchFlaw);

// watchEffect(() => {
//   console.log(watchFlaw);
//   if (watchFlaw) {
//   }
// });

watch(
  () => watchFlaw.flaw,
  (val1, val2) => {
    if (val1) {
      const { portrait, transverse, type } = val1;
      pointList.value = [
        {
          x: transverse,
          y: portrait,
          type,
        },
      ];
      const reset = pointList.value.sort((a, b) => a.y - b.y)[0];
      scaleY.value = isPowerOfTwo(reset.y / 100);

      let iconography = document.querySelector(".iconography");
      iconography.style.height = scaleY.value * installHeight.value + "px";
      loadPosition();
    }
  }
);

const { proxy } = getCurrentInstance();

const pointList = ref([]);

const scaleStyle = ref({
  fontSize: "20px",
  color: "#000",
  cursor: "pointer",
  margin: "0 10px",
});

const scaleplate = ref({
  x: 250,
  y: 25,
});

const scaleY = ref(1);

const installHeight = ref(0);
const resetHeight = ref(0);

const loadPosition = () => {
  const positionTd = document.querySelectorAll(".position-td");
  positionTd.forEach((item, index) => {
    // 第一列
    if (index % 4 === 0) {
      // 文字在表格外面
      item.innerHTML = ((index * scaleplate.value.y) / 4) * scaleY.value;
    }
    // 第一行
    if (index < 4) {
      item.innerHTML = index * scaleplate.value.x;
    }
  });
  // 先移除再添加item
  let oldPoint = document.getElementsByClassName(`point`);
  oldPoint = Array.from(oldPoint);
  if (oldPoint) {
    oldPoint.forEach((item) => {
      item.remove();
    });
  }
  pointList.value.forEach((item) => {
    // 判断是否有滚动条
    // setTimeout(() => {
    const point = document.createElement("div");
    const { x, y } = scaleTransitionToPosition(item);
    point.className = "point";
    point.style.position = "absolute";
    point.style.left = x + "px";
    point.style.top = y + "px";
    point.style.width = "20px";
    point.style.height = "20px";
    point.style.transform = "translate(-50%, -50%)";
    if (item.type === 1) {
      point.style.borderRadius = "50%";
      point.style.backgroundColor = "#EE004C";
    } else if (item.type === 2) {
      point.style.borderLeft = "10px solid transparent";
      point.style.borderRight = "10px solid transparent";
      point.style.borderBottom = "20px solid #EECE00";
    } else if (item.type === 3) {
      point.style.backgroundColor = "#00C8EE";
    }
    document.querySelector(".position").appendChild(point);

    const firstPoint = document.querySelector(".point");
    firstPoint.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  });

  // }, 0);
};

const handleScale = (scale) => {
  let currentScale = scaleY.value;
  let pass = true;
  if (scale == 0.5 && currentScale == 0.25) {
    proxy.$message.warning("已经放大到最小");
    scaleY.value = 0.25;
    pass = false;
  }
  if (scale == 2 && currentScale == 128) {
    proxy.$message.warning("已经缩小到最小");
    scaleY.value = 128;
    pass = false;
  }
  if (pass) {
    scaleY.value = scaleY.value * scale;
    inReload(scale);
  }
};

const handleToScale = (scale) => {
  scaleY.value = scale;
  outReload();
};

const inReload = (scale) => {
  let iconography = document.querySelector(".iconography");
  let iconographyParent = document.querySelector(".content-iconography");
  if (scaleY.value <= 1) {
    iconographyParent.style.height = installHeight.value + "px";
    iconography.style.height = installHeight.value + "px";
    resetHeight.value = installHeight.value;
  } else {
    setTimeout(() => {
      // resetHeight.value = resetHeight.value * scaleY.value;
      resetHeight.value = resetHeight.value * scale;
      // iconographyParent.style.height = resetHeight.value + "px";
      iconography.style.height = resetHeight.value + "px";
    }, 0);
  }
  loadPosition();
};

const outReload = () => {
  let iconography = document.querySelector(".iconography");
  let iconographyParent = document.querySelector(".content-iconography");

  iconographyParent.style.height = installHeight.value + "px";
  iconography.style.height = installHeight.value + "px";

  loadPosition();
};

const scaleTransitionToPosition = ({ x, y }) => {
  const wrapWidth = document.querySelector(".position").offsetWidth;
  const wrapHeight = document.querySelector(".position").offsetHeight;
  let positionLeft = 0;
  let positionTop = 0;
  const scaleWidth = scaleplate.value.x * 4;
  const scaleHeight = (scaleplate.value.y * 4) / scaleY.value;
  positionLeft = (x / scaleWidth) * wrapWidth;
  positionTop = (y / scaleHeight) * wrapHeight;

  return {
    x: positionLeft,
    y: positionTop,
  };
};

// 找个一个数大的最近的2的count次方
const isPowerOfTwo = (num) => {
  let count = 0;
  while (num > 1) {
    num = num / 2;
    count++;
  }
  return Math.pow(2, count);
};

onMounted(() => {
  loadPosition();

  let dom = document.querySelector(".iconography");
  installHeight.value = dom.offsetHeight;
  resetHeight.value = dom.offsetHeight;
  localStorage.setItem("installHeight", installHeight.value);
});
</script>

<style lang="less" scoped>
.iconography {
  width: 90%;
  height: 100%;
  // overflow-y: auto;

  // // 滚动条样式
  // &::-webkit-scrollbar {
  //   display: none;
  // }

  .position {
    width: 100%;
    height: 100%;
    // border: 1px solid #000;

    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .position-tr {
      width: 100%;
      height: 25%;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .position-td {
        width: 25%;
        height: 100%;
        border: 0.5px dashed #000;
      }
    }
  }
}

.scale-wrap {
  flex: 1;
  height: 100%;
  position: sticky;
  top: 0;
  right: 0;

  .scale-space {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
