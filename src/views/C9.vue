<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
  </div>
</template>

<script lang="ts" setup>
import "/node_modules/cesium/Build/Cesium/Widgets/widgets.css";
import { ApplicationContext } from "@/application";
import { onMounted, onBeforeUnmount } from "vue";
import * as Cesium from "cesium";
import { Extend } from "@/common/utils";
import { ElMessage } from "element-plus";

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
    animation: false, // 视窗动画播放速度控件
    timeline: false, // 时间轴控件
    fullscreenButton: false, // 视窗全屏按钮控件
    imageryProvider: esri, // 加载新地图
  });
  viewerIns = viewer;

  // 摆放好相机
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 6000),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });

  // 画个多边形
  viewer.entities.add({
    id: "C9_polygon",
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([116.38, 39.92, 116.38, 39.915, 116.4, 39.92]) as any,
      material: Cesium.Color.RED,
      extrudedHeight: 200,
    },
    // 弹窗信息
    description: `
    <div>Hello World</div>
    `,
  });

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction((event) => {
    const pick = viewer.scene.pick(event.position);
    // 检查是否存在空间数据
    if (Cesium.defined(pick) && pick.id.id === "C9_polygon") {
      console.log("pick", pick);
      ElMessage({
        type: "success",
        message: "Hello World",
      });
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
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
