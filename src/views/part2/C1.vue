<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";
import { ExtendUtil, CesiumUtil } from "@/common/utils";

const store = useStore();
store.dispatch("loading/setAppLoading", true);

const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;

/**
 * @example
 * 1.创建三维视窗、隐藏不必要的地图控件
 * 2.开启loading遮罩层，使用`globeReadyPromise`将其隐藏
 */
function init() {
  // 1.创建三维视窗、隐藏不必要的地图控件
  const viewer = CesiumUtil.createViewer(containerUUID);
  viewerIns = viewer;
  // 2.开启loading遮罩层，使用`globeReadyPromise`将其隐藏
  CesiumUtil.globeReadyPromise(viewer).finally(() => {
    store.dispatch("loading/setAppLoading", false);
  });
}

function destroy() {
  viewerIns?.destroy();
  viewerIns = undefined;
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
