<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
  </div>
</template>

<script lang="ts" setup>
import "/node_modules/cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Extend } from "@/common/utils";

const containerUUID = ref(Extend.uuid());
const viewerIns = ref<Cesium.Viewer>();

onMounted(() => {
  // 设置自己的accessToken
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzA0NDY3OS1iMDFiLTRmOWEtYjE3Ni05ZTY3MTEyODg0M2IiLCJpZCI6ODQyNzYsImlhdCI6MTY0NjIwNDAwNX0.wo3gAte3g3qzJTb9PSuF391rlKnM6sWJlzK1Azw8CN4";

  // 实例化并隐藏附带的操作控件
  const viewer = new Cesium.Viewer(containerUUID.value, {
    geocoder: false, // 地理位置搜索控件
    homeButton: false, // 平滑过渡到默认视角控件
    sceneModePicker: false, // 切换2D、3D地图模式控件
    baseLayerPicker: false, // 切换三维数字地球底图控件
    navigationHelpButton: false, // 帮助提示控件
    animation: false, // 视窗动画播放速度控件
    timeline: false, // 时间轴控件
    fullscreenButton: false, // 视窗全屏按钮控件
  });
  viewerIns.value = viewer;
});

onBeforeUnmount(() => {
  viewerIns.value?.destroy();
});
</script>

<style lang="scss" scoped>
.v-cesium {
  position: relative;
  height: 100%;
  .container {
    height: 100%;
    :deep(.cesium-viewer) {
      // 展示数据来源控件
      .cesium-viewer-bottom {
        display: none !important;
      }
    }
  }
}
</style>
