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

const context = ApplicationContext.current;
const containerUUID = ExtendUtil.uuid();
let viewerIns: Cesium.Viewer | undefined;

function init() {
  // 设置自己的accessToken
  Cesium.Ion.defaultAccessToken = context.cesiumIonAccessToken;

  // 新地图信息
  const esri = new Cesium.ArcGisMapServerImageryProvider({
    url: context.arcGISMapServer,
  });

  // 实例化并隐藏附带的操作控件
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
  });
  viewerIns = viewer;

  // 加载飞机模型
  const position = Cesium.Cartesian3.fromDegrees(116.39, 39.91, 1500);
  const entity = viewer.entities.add({
    position,
    model: {
      uri: "/static/Apps/SampleData/models/CesiumAir/Cesium_Air.glb",
      minimumPixelSize: 128, // 模型缩放最小情况下的大小
      maximumScale: 10000, // 模型缩放最大的比例
      show: true, // 模型是否显示
    },
  });

  // 移动相机进行观测
  viewer.trackedEntity = entity;

  // 动画循环播放
  viewer.clock.shouldAnimate = true;

  // 添加粒子特效
  viewer.scene.primitives.add(
    new Cesium.ParticleSystem({
      image: "/static/Apps/SampleData/fire.png", // 粒子样式
      imageSize: new Cesium.Cartesian2(20, 20), // 图片大小
      startScale: 1.0, // 粒子生成时的初始大小倍数
      endScale: 4.0, // 粒子消亡时的大小倍数
      particleLife: 1.0, // 每个粒子存在的时间，单位s
      speed: 5.0, // 发射粒子的速度，需要根据实际情况调试出合适值
      emitter: new Cesium.CircleEmitter(0.5), // 发射器，粒子在该范围内随机向上发射
      emissionRate: 5.0, // 每秒钟发射数量
      // 粒子系统中的位置，绑定到模型实例上
      modelMatrix: entity.computeModelMatrix(viewer.clock.startTime, new Cesium.Matrix4()),
      lifetime: 16.0, // 指定持续时间
    }),
  );
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
