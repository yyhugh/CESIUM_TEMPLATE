<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
    <transition name="r">
      <div class="control-group" v-show="panelState.refresh">
        <el-select v-model="selected" class="ctrl" placeholder="Select" @change="onSelectChange">
          <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import * as Cesium from "cesium";
import { ExtendUtil, CesiumUtil } from "@/common/utils";

const store = useStore();
const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;
const panelState = reactive({
  refresh: false,
});
const selected = ref("");
const selectOptions = reactive<Array<{ label: string; value: string }>>([
  {
    label: "addBillboard",
    value: "addBillboard",
  },
  {
    label: "setBillboardProperties",
    value: "setBillboardProperties",
  },
]);

store.dispatch("loading/setAppLoading", true);

/**
 * Beginner
 * @example
 * 画点
 */
async function init() {
  const viewer = CesiumUtil.createViewer(containerUUID);
  viewerIns = viewer;
  await CesiumUtil.globeReadyPromise(viewer);
  store.dispatch("loading/setAppLoading", false);
  panelState.refresh = true;
  // 默认选中项
  selected.value = "addBillboard";
  addBillboard(viewer);
}

function destroy() {
  viewerIns?.destroy();
  viewerIns = undefined;
}

function onSelectChange(v: string) {
  const viewer = viewerIns as Cesium.Viewer;
  if (v === "addBillboard") {
    addBillboard(viewer);
  } else if (v === "setBillboardProperties") {
    setBillboardProperties(viewer);
  }
}

function addBillboard(viewer: Cesium.Viewer) {
  const position = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
  const image = "/static/Apps/Sandcastle/images/Cesium_Logo_overlay.png";
  viewer.entities.add({
    // 1.所在位置 = 将已知的经纬度转成空间直角坐标系的坐标值
    position,
    // 2.空间数据类型：图片
    billboard: {
      image,
    },
  });
}

function setBillboardProperties(viewer: Cesium.Viewer) {
  const position = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
  const image = "/static/Apps/Sandcastle/images/Cesium_Logo_overlay.png";
  viewer.entities.add({
    position,
    billboard: {
      image,
      show: true,
      pixelOffset: new Cesium.Cartesian2(0, -50),
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
