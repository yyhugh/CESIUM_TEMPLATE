<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount } from "vue";
import * as Cesium from "cesium";
import { ApplicationContext } from "@/application";
import { Extend } from "@/common/utils";

const containerUUID = Extend.uuid();
let viewerIns: Cesium.Viewer | undefined;

function init() {
  // 实例化并隐藏附带的操作控件
  const viewer = new Cesium.Viewer(containerUUID, {
    // geocoder: false, // 地理位置搜索控件
    // homeButton: false, // 平滑过渡到默认视角控件
    // sceneModePicker: false, // 切换2D、3D地图模式控件
    // baseLayerPicker: false, // 切换三维数字地球底图控件
    // navigationHelpButton: false, // 帮助提示控件
    // animation: false, // 视窗动画播放速度控件
    // timeline: false, // 时间轴控件
    // fullscreenButton: false, // 视窗全屏按钮控件
    // 将地形数据转换成Cesium能够访问的格式
    terrainProvider: Cesium.createWorldTerrain(),
  });
  viewerIns = viewer;
  const { scene, camera, clock } = viewer;

  // 调整相机位置进行观测
  camera.setView({
    destination: new Cesium.Cartesian3(1216403.8845586285, -4736357.493351395, 4081299.715698949),
    orientation: new Cesium.HeadingPitchRoll(4.2892217081808806, -0.4799070147502502, 6.279789177843313),
    endTransform: Cesium.Matrix4.IDENTITY,
  });

  let entity: Cesium.Entity, positionProperty: Cesium.PositionProperty;
  const dataSourcePromise = Cesium.CzmlDataSource.load("static/Apps/SampleData/ClampToGround.czml");

  viewer.dataSources.add(dataSourcePromise).then((dataSource) => {
    entity = dataSource.entities.getById("CesiumMilkTruck") as Cesium.Entity;
    positionProperty = entity.position as Cesium.PositionProperty;
    clock.shouldAnimate = true;
    scene.postRender.addEventListener(() => {
      // 拿到当前位置信息
      const currentPosition = positionProperty.getValue(clock.currentTime);
      // 计算夹紧高度后重新定位
      entity.position = scene.clampToHeight(currentPosition, [entity]) as any;
    });
  });
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
