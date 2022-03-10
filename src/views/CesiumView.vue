<template>
  <div class="v-cesium">
    <div id="cesiumContainer"></div>
    <div class="control-group">
      <el-button type="primary" @click="reset">重置</el-button>
      <el-button type="primary" @click="() => createModel(glbUrl)">
        加载glb飞机
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "/node_modules/cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
import { onMounted, ref } from "vue";

const reset = ref();
const createModel = ref();
const glbUrl = ref("/static/Apps/SampleData/models/CesiumAir/Cesium_Air.glb");

onMounted(() => {
  // 设置自己的accessToken
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhMzA0NDY3OS1iMDFiLTRmOWEtYjE3Ni05ZTY3MTEyODg0M2IiLCJpZCI6ODQyNzYsImlhdCI6MTY0NjIwNDAwNX0.wo3gAte3g3qzJTb9PSuF391rlKnM6sWJlzK1Azw8CN4";

  // 实例化并隐藏附带的操作控件
  const viewer = new Cesium.Viewer("cesiumContainer", {
    geocoder: false, // 地理位置搜索控件
    homeButton: false, // 平滑过渡到默认视角控件
    sceneModePicker: false, // 切换2D、3D地图模式控件
    baseLayerPicker: false, // 切换三维数字地球底图控件
    navigationHelpButton: false, // 帮助提示控件
    animation: false, // 视窗动画播放速度控件
    timeline: false, // 时间轴控件
    fullscreenButton: false, // 视窗全屏按钮控件
  });

  // 加载3D tileset
  const tileset = new Cesium.Cesium3DTileset({
    url: "/static/Apps/SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json",
  });

  // ? 官方声明文件中类型缺失，自己补充类型
  interface ICesium3DTilesetReadyPromise<T = unknown> extends Promise<unknown> {
    /**
     * 当加载异常时触发
     */
    otherwise: (fn: (error: unknown) => void) => T;
  }

  const readyPromise = tileset.readyPromise.then((tileset) => {
    // 添加tileset到viewer
    viewer.scene.primitives.add(tileset);
    const defaultHeadingPitchRange = new Cesium.HeadingPitchRange(
      0.0,
      -0.5,
      tileset.boundingSphere.radius * 2.0
    );
    // 聚焦tileset
    viewer.zoomTo(tileset, defaultHeadingPitchRange);
    // 重置视窗位置
    reset.value = () => {
      viewer.zoomTo(tileset, defaultHeadingPitchRange);
    };
  }) as ICesium3DTilesetReadyPromise;
  readyPromise.otherwise((error) => {
    console.error("加载失败", error);
  });

  // 加载glb飞机
  createModel.value = (url: string, height: number) => {
    viewer.entities.removeAll();
    const position = Cesium.Cartesian3.fromDegrees(116.39, 39.93, 60);
    const heading = Cesium.Math.toRadians(135);
    const pitch = 0;
    const roll = 0;
    const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    const quaternion = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    ) as any;
    const entity = viewer.entities.add({
      name: url,
      position,
      orientation: quaternion,
      model: {
        uri: url,
        minimumPixelSize: 128,
        maximumScale: 20000,
      },
    });
    viewer.trackedEntity = entity;
  };
});
</script>

<style lang="scss" scoped>
.v-cesium {
  position: relative;
  height: 100%;
  #cesiumContainer {
    height: 100%;
    :deep(.cesium-viewer) {
      // 展示数据来源控件
      .cesium-viewer-bottom {
        display: none !important;
      }
    }
  }
  .control-group {
    position: absolute;
    top: 0;
    right: 0;
    button {
      margin: 20px 20px 0 0;
    }
  }
}
</style>
