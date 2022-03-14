<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
  </div>
</template>

<script lang="ts" setup>
import "/node_modules/cesium/Build/Cesium/Widgets/widgets.css";
import { ApplicationContext } from "@/application";
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as Cesium from "cesium";
import { Extend } from "@/common/utils";

const context = ApplicationContext.current;
const containerUUID = ref(Extend.uuid());
const viewerIns = ref<Cesium.Viewer>();

function init() {
  // 设置自己的accessToken
  Cesium.Ion.defaultAccessToken = context.cesiumIonAccessToken;

  // 新地图信息
  const esri = new Cesium.ArcGisMapServerImageryProvider({
    url: context.arcGISMapServer,
  });

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
    imageryProvider: esri, // 加载新地图
  });
  viewerIns.value = viewer;

  // 摆放好相机位置
  viewer.camera.setView({
    // 目的地
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9066, 2500),
    // 方向
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });

  // ---点 point---
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.39, 39.91),
    point: {
      pixelSize: 100,
      color: new Cesium.Color(1, 0, 0, 1),
    },
  });

  // ---线 polyline---
  viewer.entities.add({
    polyline: {
      show: true,
      positions: Cesium.Cartesian3.fromDegreesArray([
        116.39, 39.9066, 116.4, 39.9066,
      ]),
      width: 5,
      material: new Cesium.Color(0, 0, 1, 1),
    },
  });

  // ---面 plane---
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.39, 39.9022),
    plane: {
      // 确认面的朝向，这里设置为沿着z轴平铺
      plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0),
      // 设置长宽
      dimensions: new Cesium.Cartesian2(400, 300),
      // 材质为红色 透明度0.5
      material: Cesium.Color.RED.withAlpha(0.5),
      // 边框
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  });

  // ---文字 label---
  viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(116.383, 39.9066),
    label: {
      text: "Hello World",
      font: "50px Hack",
      fillColor: Cesium.Color.SKYBLUE,
    },
  });

  // ---glb小飞机---
  const position = Cesium.Cartesian3.fromDegrees(116.37, 39.88, 3000);
  const hpr = new Cesium.HeadingPitchRoll(-90, 0, 0);
  const quaternion = Cesium.Transforms.headingPitchRollQuaternion(
    position,
    hpr
  ) as any;
  const planeEntity = viewer.entities.add({
    position,
    orientation: quaternion,
    model: {
      uri: "/static/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
      minimumPixelSize: 128, // 模型缩放最小情况下的大小
      maximumScale: 10000, // 模型缩放最大的比例
      show: true, // 模型是否显示
    },
  });
  // viewer.trackedEntity = planeEntity;
}

function destroy() {
  viewerIns.value?.destroy();
  viewerIns.value = undefined;
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
