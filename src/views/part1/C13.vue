<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import * as Cesium from "cesium";
import { ElMessage } from "element-plus";
import { ApplicationContext } from "@/application";
import { ExtendUtil } from "@/common/utils";

const context = ApplicationContext.current;
const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;

function createViewer() {
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
    animation: false, // 视窗动画播放速度控件
    timeline: false, // 时间轴控件
    fullscreenButton: false, // 视窗全屏按钮控件
    imageryProvider: esri, // 加载新地图
  });
  viewerIns = viewer;

  // 设置动画
  viewer.clock.shouldAnimate = true; // 设置循环动画
  viewer.clock.multiplier = 1000; // 动画速率

  return viewer;
}

function onGlobeTileLoaded(viewer: Cesium.Viewer, callback: () => void) {
  const eventHelper = new Cesium.EventHelper();
  eventHelper.add(viewer.scene.globe.tileLoadProgressEvent, (event) => {
    console.log("event", event);
    // 注意：存在不出现0的情况
    if (event === 0) {
      eventHelper.removeAll();
      callback();
    }
  });
}

function init() {
  const viewer = createViewer();

  onGlobeTileLoaded(viewer, () => {
    ElMessage({
      type: "success",
      message: "[hook] onGlobeTileLoaded: OK!",
    });
  });
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
