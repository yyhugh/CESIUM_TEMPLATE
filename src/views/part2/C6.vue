<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";
import { ApplicationContext } from "@/application";
import { ExtendUtil, CesiumUtil } from "@/common/utils";

const context = ApplicationContext.current;
const store = useStore();
store.dispatch("loading/setAppLoading", true);

const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;
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
          console.log("[drawSpreadRing]");
        },
      );
    });
    collectTimer.add(cancel);
  });
}

function destroy() {
  viewerIns?.destroy();
  viewerIns = undefined;
  CesiumUtil.recoverTimer(collectTimer);
}

onMounted(init);
onBeforeUnmount(destroy);
</script>

<style lang="scss" scoped>
.v-cesium {
  position: relative;
  height: 100%;
  .container {
    height: 100%;
  }
}
</style>
