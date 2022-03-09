<template>
  <div class="v-cesium">
    <div id="cesiumContainer"></div>
  </div>
</template>

<script lang="ts" setup>
import "/node_modules/cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
import { onMounted } from "vue";

onMounted(() => {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzA0NDY3OS1iMDFiLTRmOWEtYjE3Ni05ZTY3MTEyODg0M2IiLCJpZCI6ODQyNzYsImlhdCI6MTY0NjIwNDAwNX0.wo3gAte3g3qzJTb9PSuF391rlKnM6sWJlzK1Azw8CN4";

  // 实例化并隐藏附带的操作控件
  new Cesium.Viewer("cesiumContainer", {
    geocoder: false, // 地理位置搜索控件
    homeButton: false, // 平滑过渡到默认视角控件
    sceneModePicker: false, // 切换2D、3D地图模式控件
    baseLayerPicker: false, // 切换三维数字地球底图控件
    navigationHelpButton: false, // 帮助提示控件
    animation: false, // 视窗动画播放速度控件
    timeline: false, // 时间轴控件
    fullscreenButton: false, // 视窗全屏按钮控件
  });
});
</script>

<style lang="scss" scoped>
.v-cesium {
  height: 100%;
  #cesiumContainer {
    height: 100%;
    ::v-deep .cesium-viewer {
      // 展示数据来源控件
      .cesium-viewer-bottom {
        display: none !important;
      }
    }
  }
}
</style>
