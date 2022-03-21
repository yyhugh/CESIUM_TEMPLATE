<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
    <div class="control-group">
      <el-button type="primary" @click="getCamera">获取相机位置信息</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as Cesium from "cesium";
import { ApplicationContext } from "@/application";
import { Extend } from "@/common/utils";
import { MAP_ASSET_ID } from "@/common/enums";

const context = ApplicationContext.current;
const containerUUID = Extend.uuid();
const getCamera = ref();
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
    geocoder: false, // 地理位置搜索控件
    homeButton: false, // 平滑过渡到默认视角控件
    sceneModePicker: false, // 切换2D、3D地图模式控件
    baseLayerPicker: false, // 切换三维数字地球底图控件
    navigationHelpButton: false, // 帮助提示控件
    animation: false, // 视窗动画播放速度控件
    timeline: false, // 时间轴控件
    fullscreenButton: false, // 视窗全屏按钮控件
    imageryProvider: esri, // 加载新地图
    // 将地形数据转换成Cesium能够访问的格式
    terrainProvider: new Cesium.CesiumTerrainProvider({
      url: Cesium.IonResource.fromAssetId(MAP_ASSET_ID.PAMapTerrain), // 地形服务器地址
      requestVertexNormals: true, // 增加法线，用于提高光照效果
      requestWaterMask: true, // 增加水面特效
    }),
  });
  viewerIns = viewer;

  // ---无高度建筑物图层---

  // // 加载建筑物
  // const tileset = viewer.scene.primitives.add(
  //   // 用于传输海量异构3D地理空间数据集
  //   new Cesium.Cesium3DTileset({
  //     url: Cesium.IonResource.fromAssetId(MAP_ASSET_ID.CesiumOSMBuildings),
  //   })
  // );

  // // 调整相机位置
  // viewer.camera.setView({
  //   // 设置经纬度位置和相机高度
  //   destination: Cesium.Cartesian3.fromDegrees(121.49, 31.23, 3000),
  //   // 设置相机方向
  //   orientation: {
  //     heading: 0,
  //     pitch: -90,
  //     roll: 0,
  //   },
  // });

  // // 调整建筑物样式
  // tileset.style = new Cesium.Cesium3DTileStyle({
  //   color: "color('blue', 0.5)",
  //   show: true,
  // });

  // ---有高度建筑物图层---

  // 加载建筑物
  const tileset = viewer.scene.primitives.add(
    // 用于传输海量异构3D地理空间数据集
    new Cesium.Cesium3DTileset({
      url: Cesium.IonResource.fromAssetId(MAP_ASSET_ID.NewYorkCity3DBuildings),
    }),
  );

  // 调整相机位置
  viewer.camera.setView({
    // 设置经纬度位置和相机高度
    destination: new Cesium.Cartesian3(1330874.9726811291, -4658344.382042736, 4137231.8554648715),
    // 设置相机方向
    orientation: {
      heading: 0.9721266342429953,
      pitch: -0.28001226442022786,
      roll: 0.00017862563172332813,
    },
  });
  // 1.0893114962779187 -0.7513685946209656 0.000010168748770134073

  // 调整建筑物样式
  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      // 给不同高度的建筑物设置不同颜色
      conditions: [
        ["${Height} >= 300", "rgba(45, 0, 75, 0.5)"],
        ["${Height} >= 200", "rgb(102, 71, 151)"],
        ["${Height} >= 100", "rgb(170, 162, 204)"],
        ["${Height} >= 50", "rgb(224, 226, 238)"],
        ["${Height} >= 25", "rgb(252, 71, 151)"],
        ["${Height} >= 10", "rgb(248, 176, 87)"],
        ["${Height} >= 5", "rgb(198, 106, 11)"],
        ["true", "rgb(127, 59, 8)"],
      ],
    },
    show: "${Height} >= 0",
  });

  getCamera.value = () => {
    const { heading, pitch, roll } = viewer.camera;
    console.log("---");
    console.log("position", viewer.camera.position);
    console.log(heading, pitch, roll);
  };
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
