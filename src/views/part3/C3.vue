<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
    <transition name="r">
      <div class="control-group" v-show="panelState.refresh">
        <el-icon class="ctrl refresh" color="#409EFC" :size="20" @click="refreshCamera"><refresh-left /></el-icon>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";
import { RefreshLeft } from "@element-plus/icons-vue";
import { ExtendUtil, CesiumUtil } from "@/common/utils";

const store = useStore();
store.dispatch("loading/setAppLoading", true);

const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;
const panelState = reactive({
  refresh: false,
});

/**
 * Beginner
 * @example
 * 1.加载Cesium默认地形
 * 2.将Cesium OSM建筑群加到场景中
 */
async function init() {
  // 创建三维视窗、隐藏不必要的地图控件
  const viewer = CesiumUtil.createViewer(containerUUID, {
    terrainProvider: Cesium.createWorldTerrain(), // 1.加载Cesium默认地形
  });
  viewerIns = viewer;
  await CesiumUtil.globeReadyPromise(viewer);
  store.dispatch("loading/setAppLoading", false);
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-122.3472, 47.598, 370),
    orientation: {
      heading: Cesium.Math.toRadians(10),
      pitch: Cesium.Math.toRadians(-10),
    },
  });
  panelState.refresh = true;

  const osmBuildingsTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings()); // 2.将Cesium OSM建筑群加到场景中
  osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
    defines: {
      material: "${feature['building:material']}",
    },
    color: {
      conditions: [
        ["${material} === null", "color('white')"],
        ["${material} === 'glass'", "color('skyblue', 0.5)"],
        ["${material} === 'concrete'", "color('grey')"],
        ["${material} === 'brick'", "color('indianred')"],
        ["${material} === 'stone'", "color('lightslategrey')"],
        ["${material} === 'metal'", "color('lightgrey')"],
        ["${material} === 'steel'", "color('lightsteelblue')"],
        ["true", "color('white')"],
      ],
    },
  });
}

function destroy() {
  viewerIns?.destroy();
  viewerIns = undefined;
}

function refreshCamera() {
  const viewer = viewerIns as Cesium.Viewer;
  viewer.scene.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(-122.3472, 47.598, 370),
    orientation: {
      heading: Cesium.Math.toRadians(10),
      pitch: Cesium.Math.toRadians(-10),
    },
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
