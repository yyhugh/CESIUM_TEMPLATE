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
const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;

store.dispatch("loading/setAppLoading", true);

/**
 * Beginner
 * @example
 * 加载地形
 */
async function init() {
  const viewer = CesiumUtil.createViewer(containerUUID, {
    terrainProvider: new Cesium.ArcGISTiledElevationTerrainProvider({
      url: "https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer",
    }),
  });
  viewerIns = viewer;
  await CesiumUtil.globeReadyPromise(viewer);
  store.dispatch("loading/setAppLoading", false);
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
  overflow: hidden;
  position: relative;
  height: 100%;
  .container {
    height: 100%;
  }
  .control-group {
    position: absolute;
    top: 15px;
    right: 0;
    display: flex;
    :deep(.ctrl) {
      margin: 0 15px 0 0;
      &.refresh {
        font-size: 16px;
        color: red;
        width: 32px;
        height: 32px;
        border-radius: 4px;
        cursor: pointer;
        background-color: #fff;
        box-shadow: rgb(220, 223, 230) 0px 0px 0px 1px inset;
        svg {
          transition: transform 0.3s 0.05s;
        }
        &:hover {
          svg {
            transition: transform 0.3s 0.05s;
            transform: rotate(-270deg);
          }
        }
      }
    }
  }
  .r-enter-active,
  .r-leave-active {
    transition: transform 0.5s;
  }
  .r-enter-from,
  .r-leave-to {
    transform: translateX(500px);
  }
}
</style>
