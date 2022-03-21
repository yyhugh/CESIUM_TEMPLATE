<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import * as Cesium from "cesium";
import { ApplicationContext } from "@/application";
import { Extend } from "@/common/utils";

const context = ApplicationContext.current;
const containerUUID = Extend.uuid();
let viewerIns: Cesium.Viewer | undefined;

function init() {
  // 设置自己的accessToken
  Cesium.Ion.defaultAccessToken = context.cesiumIonAccessToken;

  // 新地图信息
  const esri = new Cesium.ArcGisMapServerImageryProvider({
    url: context.arcGISMapServer,
  });

  // 实例化并隐藏附带的操作控件
  const viewer = new Cesium.Viewer(containerUUID, {
    geocoder: false, // 地理位置搜索控件
    homeButton: false, // 平滑过渡到默认视角控件
    sceneModePicker: false, // 切换2D、3D地图模式控件
    baseLayerPicker: false, // 切换三维数字地球底图控件
    navigationHelpButton: false, // 帮助提示控件
    // animation: false, // 视窗动画播放速度控件
    // timeline: false, // 时间轴控件
    fullscreenButton: false, // 视窗全屏按钮控件
    imageryProvider: esri, // 加载新地图
  });
  viewerIns = viewer;

  const { clock } = viewer;

  clock.shouldAnimate = true; // 动画循环播放
  clock.multiplier = 1000; // 时间速率

  // 设置时间线
  const startTime = Cesium.JulianDate.fromIso8601("2022-03-15");
  const endTime = Cesium.JulianDate.fromIso8601("2022-03-16");
  viewer.timeline.zoomTo(startTime, endTime);
}

function destroy() {
  viewerIns?.destroy();
  viewerIns = undefined;
}

onMounted(() => {
  init();
});

onBeforeUnmount(() => {
  destroy();
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
