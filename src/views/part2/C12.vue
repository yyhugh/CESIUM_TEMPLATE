<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
    <transition name="r">
      <div class="control-group" v-show="panelShow">
        <el-icon class="ctrl refresh" color="#409EFC" :size="20" @click="refreshCamera"><refresh-left /></el-icon>
        <el-button class="ctrl" type="success" @click="only = false" v-if="only">当前仅显示一个</el-button>
        <el-button class="ctrl" type="info" @click="only = true" v-else>当前可显示多个</el-button>
      </div>
    </transition>
    <TextTooltip
      v-for="(item, i) in pointTooltipList"
      :key="i"
      :show="item.show"
      :z-index="item.zIndex"
      :offset-y="-40"
      :ref="(ref: any) => setPointTooltipRef(ref, i)"
      @click="() => onPointTooltipClick(item, i)"
    ></TextTooltip>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";
import { RefreshLeft } from "@element-plus/icons-vue";
import { TextTooltip } from "@/components";
import { ExtendUtil, CesiumUtil } from "@/common/utils";

const store = useStore();
store.dispatch("loading/setAppLoading", true);

const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;
const collectTimer = CesiumUtil.collectTimer();
const panelShow = ref(false);
const pointTooltipList = reactive<Array<{ id: string; show: boolean; zIndex: number; ref: any }>>([]);
const only = ref(true);

/**
 * @example
 * 多点仅显示一个信息框、多点同时显示多个信息窗
 */
function init() {
  const viewer = CesiumUtil.createViewer(containerUUID);
  viewerIns = viewer;
  viewer.clock.shouldAnimate = true;
  viewer.clock.multiplier = 1000;
  CesiumUtil.globeReadyPromise(viewer).finally(() => {
    store.dispatch("loading/setAppLoading", false);
    const cancel = CesiumUtil.cameraFlytoShenzhen(viewer, 3, 2.2, async () => {
      panelShow.value = true;
      getData();
    });
    collectTimer.add(cancel);
  });
}

function destroy() {
  viewerIns?.destroy();
  viewerIns = undefined;
  CesiumUtil.recoverTimer(collectTimer);
}

function refreshCamera() {
  const viewer = viewerIns as Cesium.Viewer;
  CesiumUtil.cameraFlytoShenzhen(viewer, 2);
}

function getData() {
  const viewer = viewerIns as Cesium.Viewer;
  const list = CesiumUtil.grid(viewer, {
    lnglat: [114.040912, 22.699857],
    total: 9,
    cols: 3,
    gap: [100, 100],
  });
  list.forEach((position, i) => {
    const id = `point-${i}`;
    viewer.entities.add({
      id,
      position,
      point: {
        pixelSize: 60,
        color: new Cesium.Color(0, 1, 0, 1),
      },
    });
    pointTooltipList.push({
      id,
      show: false,
      zIndex: 1,
      ref: null,
    });
  });
  CesiumUtil.onClick(viewer, (event, pick) => {
    const id = pick.id.id as string;
    if (id.includes("point-")) {
      if (only.value) {
        pointTooltipList.forEach((item, i) => {
          if (item.id !== id) {
            pointTooltipList[i].show = false;
          }
        });
      }
      const targetIndex = pointTooltipList.findIndex((item) => item.id === id);
      const maxZIndex = Math.max(...pointTooltipList.map((v) => v.zIndex));
      pointTooltipList[targetIndex].zIndex = maxZIndex + 1;
      pointTooltipList[targetIndex].show = !pointTooltipList[targetIndex].show;
      const tooltipRef = pointTooltipList[targetIndex].ref;
      const pointHandler = () => {
        if (pointTooltipList[targetIndex].show) {
          const winPos = viewer.scene.cartesianToCanvasCoordinates(pick.id.position._value);
          tooltipRef.setPosition(winPos);
        }
      };
      viewer.scene.postRender.addEventListener(pointHandler);
    }
  });
}

function setPointTooltipRef<T>(ref: T, i: number) {
  pointTooltipList[i].ref = ref;
}

function onPointTooltipClick<T>(item: T, i: number) {
  const maxZIndex = Math.max(...pointTooltipList.map((v) => v.zIndex));
  pointTooltipList[i].zIndex = maxZIndex + 1;
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
