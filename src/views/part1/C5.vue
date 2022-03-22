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
import { MAP_ASSET_ID } from "@/common/enums";

const context = ApplicationContext.current;
const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;

function init() {
  // 设置自己的accessToken
  Cesium.Ion.defaultAccessToken = context.cesiumIonAccessToken;

  // ---加载新地图---

  // 新地图信息
  // const esri = new Cesium.ArcGisMapServerImageryProvider({
  //   url: context.arcGISMapServer,
  // });

  // ① Viewer Options.imageryProvider
  // const viewer = new Cesium.Viewer(containerUUID, {
  //   baseLayerPicker: false, // 切换三维数字地球底图控件，加载新地图时需隐藏
  //   imageryProvider: esri, // 加载新地图
  // });
  // viewerIns = viewer;

  // ② addImageryProvider
  // viewer.imageryLayers.addImageryProvider(
  //   new Cesium.IonImageryProvider({ assetId: MAP_ASSET_ID.EarthAtNight }) // 通过ID指向资产包
  // );

  // ---加载新地形---

  // 新地图信息
  const esri = new Cesium.ArcGisMapServerImageryProvider({
    url: context.arcGISMapServer,
  });
  const viewer = new Cesium.Viewer(containerUUID, {
    baseLayerPicker: false, // 切换三维数字地球底图控件，加载新地图时需隐藏
    imageryProvider: esri, // 加载新地图
    // 将地形数据转换成Cesium能够访问的格式
    terrainProvider: new Cesium.CesiumTerrainProvider({
      url: Cesium.IonResource.fromAssetId(MAP_ASSET_ID.PAMapTerrain), // 地形服务器地址
      requestVertexNormals: true, // 增加法线，用于提高光照效果
      requestWaterMask: true, // 增加水面特效
    }),
  });
  viewerIns = viewer;
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
