<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
    <div class="heatmap" ref="heatmapContainer"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";
import { ApplicationContext } from "@/application";
import { ExtendUtil, CesiumUtil } from "@/common/utils";

const context = ApplicationContext.current;
const store = useStore();
store.dispatch("loading/setAppLoading", true);

const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;
const heatmapContainer = ref();
const collectTimer = CesiumUtil.collectTimer();

/**
 * @example
 * 1.创建三维视窗、隐藏不必要的地图控件
 * 2.开启loading遮罩层，使用`globeReadyPromise`将其隐藏
 * 3.使用不同的地图
 * 4.开启动画
 * 5.相机视角移动到深圳
 * 6.加载高德矢量图层
 * 7.绘制行政区域边界线
 * 8.绘制扩散圆环
 * 9.绘制点、线、面、文字、图片、模型
 * 10.绘制热力图
 * 11.关闭时间对模型亮度的影响
 * 12.监听各种点击、移入事件
 */
function init() {
  const esri = new Cesium.ArcGisMapServerImageryProvider({
    url: context.arcGISMapServer,
  });
  // 1.创建三维视窗、隐藏不必要的地图控件
  const viewer = CesiumUtil.createViewer(containerUUID, {
    imageryProvider: esri, // 3.使用不同的地图
  });
  viewerIns = viewer;
  // 4.开启动画
  viewer.clock.shouldAnimate = true; // 设置循环动画
  viewer.clock.multiplier = 1000; // 动画速率
  // 2.开启loading遮罩层，使用`globeReadyPromise`将其隐藏
  CesiumUtil.globeReadyPromise(viewer).finally(() => {
    store.dispatch("loading/setAppLoading", false);
    // 5.相机视角移动到深圳
    const cancel = CesiumUtil.cameraFlytoShenzhen(viewer, 3, 2.2, async () => {
      // 6.加载高德矢量图层
      const layer = await CesiumUtil.getAMapTileLayerRoadNet();
      viewer.imageryLayers.addImageryProvider(layer);
      // 7.绘制行政区域边界线
      await CesiumUtil.drawAreaPolyline(viewer, "深圳市");
      await CesiumUtil.drawAreaPolyline(viewer, "深汕特别合作区");
      // 8.绘制扩散圆环
      CesiumUtil.drawSpreadRing(
        viewer,
        {
          count: 1,
          center: [114.18274, 22.633947],
          minorAxisOptions: {
            max: 66000,
            min: 0,
            step: 400,
            r: 0,
          },
          majorAxisOptions: {
            max: 66000,
            min: 0,
            step: 400.01,
            r: 0,
          },
        },
        () => {
          // 9.绘制点、线、面、文字、图片、模型
          draw();
        },
      );
    });
    collectTimer.add(cancel);
  });
  // 11.关闭时间对模型亮度的影响
  viewer.scene.light = new Cesium.DirectionalLight({
    direction: new Cesium.Cartesian3(0.354925, -0.890918, -0.283358),
  });
  // 12.监听各种点击、移入事件
  CesiumUtil.on("click", viewer, (event) => {
    const pick = viewer.scene.pick(event.position);
    // 检查是否存在空间数据
    if (Cesium.defined(pick)) {
      console.log(pick.id.id); // 访问空间数据id
    }
  });
  CesiumUtil.on("mousemove", viewer, (event) => {
    const pick = viewer.scene.pick(event.startPosition);
    // 检查是否存在空间数据
    if (Cesium.defined(pick)) {
      console.log(pick.id.id); // 访问空间数据id
    }
  });
}

function destroy() {
  viewerIns?.destroy();
  viewerIns = undefined;
  CesiumUtil.recoverTimer(collectTimer);
}

function draw() {
  const viewer = viewerIns as Cesium.Viewer;
  // ---点 point---
  viewer.entities.add({
    id: "点",
    position: Cesium.Cartesian3.fromDegrees(114.18274, 22.733947),
    point: {
      pixelSize: 60,
      color: new Cesium.Color(0, 1, 0, 1),
    },
  });
  // ---线 polyline---
  viewer.entities.add({
    id: "线",
    polyline: {
      show: true,
      positions: Cesium.Cartesian3.fromDegreesArray([114.18274, 22.633947, 114.48574, 22.633947]),
      width: 5,
      material: new Cesium.Color(1, 0, 0, 1),
    },
  });
  // ---面 plane---
  viewer.entities.add({
    id: "面",
    position: Cesium.Cartesian3.fromDegrees(114.18274, 22.523947),
    plane: {
      // 确认面的朝向，这里设置为沿着z轴平铺
      plane: new Cesium.Plane(Cesium.Cartesian3.UNIT_Z, 0),
      // 设置长宽
      dimensions: new Cesium.Cartesian2(8000, 6000),
      // 材质为红色 透明度0.5
      material: Cesium.Color.RED.withAlpha(0.5),
      // 边框
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  });
  // ---文字 label---
  viewer.entities.add({
    id: "文字",
    position: Cesium.Cartesian3.fromDegrees(114.02274, 22.633947),
    label: {
      text: "Hello World",
      font: "50px Hack",
      fillColor: Cesium.Color.SKYBLUE,
    },
  });
  // ---图片 billboard---
  viewer.entities.add({
    id: "图片",
    position: Cesium.Cartesian3.fromDegrees(113.988244, 22.490484, 0),
    billboard: {
      image: "/static/img/xg.svg",
      color: new Cesium.Color(1, 0, 0, 1),
      width: 68,
      height: 68,
      sizeInMeters: false,
    },
  });
  // ---glb小飞机 model---
  const airPosition = Cesium.Cartesian3.fromDegrees(114.335344, 22.527592, 3000);
  const airHpr = new Cesium.HeadingPitchRoll(-90, 0, 0);
  const airQuaternion = Cesium.Transforms.headingPitchRollQuaternion(airPosition, airHpr) as any;
  viewer.entities.add({
    id: "glb小飞机",
    position: airPosition,
    orientation: airQuaternion,
    model: {
      uri: "/static/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
      minimumPixelSize: 528, // 模型缩放最小情况下的大小
      maximumScale: 10000, // 模型缩放最大的比例
      show: true, // 模型是否显示
    },
  });
  // 10.绘制热力图
  const group = new Map();
  group.set("113.870141,22.661038", [{}, {}]);
  CesiumUtil.drawHeatmap(viewer, {
    container: heatmapContainer.value,
    group,
    range: [113.681448, 22.867816, 114.733389, 22.386134],
    radius: 40,
  });
}

onMounted(init);
onBeforeUnmount(destroy);
</script>

<style lang="scss" scoped>
.v-cesium {
  overflow: hidden;
  position: relative;
  height: 100%;
  .container {
    height: 100%;
  }
  .heatmap {
    position: absolute !important;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
}
</style>
