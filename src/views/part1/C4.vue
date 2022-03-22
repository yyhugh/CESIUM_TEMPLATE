<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import * as Cesium from "cesium";
import { ApplicationContext } from "@/application";
import { ExtendUtil } from "@/common/utils";

const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;

function init() {
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
  });
  viewerIns = viewer;

  // 加载glb飞机
  const position = Cesium.Cartesian3.fromDegrees(116.39, 39.91, 1500);
  viewer.entities.add({
    name: "glbPlane",
    position,
    model: {
      uri: "/static/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
      minimumPixelSize: 128, // 模型缩放最小情况下的大小
      maximumScale: 10000, // 模型缩放最大的比例
      show: true, // 模型是否显示
    },
  });

  // ①
  // viewer.camera.setView({
  //   destination: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 1555),
  //   orientation: {
  //     heading: Cesium.Math.toRadians(0),
  //     pitch: Cesium.Math.toRadians(-90),
  //     roll: Cesium.Math.toRadians(0),
  //   },
  // });

  // ②
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 1555),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0),
    },
  });

  // ③
  // viewer.camera.lookAt(
  //   Cesium.Cartesian3.fromDegrees(116.39, 39.91),
  //   new Cesium.HeadingPitchRange(
  //     Cesium.Math.toRadians(50),
  //     Cesium.Math.toRadians(-90),
  //     5000
  //   )
  // );

  // ④
  // viewer.camera.viewBoundingSphere(
  //   new Cesium.BoundingSphere(position, 30), // 目标点位置
  //   new Cesium.HeadingPitchRange(0, 0, 0) // 相机朝向
  // );
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
  .control-group {
    position: absolute;
    top: 0;
    right: 0;
    button {
      margin: 20px 20px 0 0;
    }
  }
}
</style>
