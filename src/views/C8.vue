<template>
  <div class="v-cesium">
    <div class="container" :id="containerUUID"></div>
    <div class="control-group">
      <el-button type="primary" @click="() => addPolygon('C8_first')" v-if="!isShow">新增</el-button>
      <el-button type="primary" @click="() => removePolygonById('C8_first')" v-if="isShow">删除</el-button>
      <el-button type="primary" @click="() => editStyle('C8_first')" v-if="isShow">修改样式</el-button>
      <el-button type="primary" @click="removeAll">移除所有数据</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as Cesium from "cesium";
import { ApplicationContext } from "@/application";
import { Extend } from "@/common/utils";

const context = ApplicationContext.current;
const containerUUID = Extend.uuid();
let viewerIns: Cesium.Viewer | undefined;

const addPolygon = ref();
const removePolygonById = ref();
const editStyle = ref();
const removeAll = ref();
const isShow = ref(false);

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

  // 摆放好相机
  viewer.camera.setView({
    // 目的地
    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.91, 6000),
    // 方向
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: 0,
    },
  });

  // 多边形
  viewer.entities.add({
    // 设置多边形
    polygon: {
      // 放入多边形位置信息
      hierarchy: Cesium.Cartesian3.fromDegreesArray([116.39, 39.91, 116.39, 39.915, 116.395, 39.91]) as any,
      material: Cesium.Color.RED,
      // 垂直拉升
      extrudedHeight: 200,
    },
  });

  addPolygon.value = (id: string) => {
    // 多边形
    viewer.entities.add({
      id,
      // 设置多边形
      polygon: {
        // 放入多边形位置信息
        hierarchy: Cesium.Cartesian3.fromDegreesArray([116.38, 39.92, 116.38, 39.915, 116.4, 39.92]) as any,
        material: Cesium.Color.SKYBLUE,
        // 垂直拉升
        extrudedHeight: 200,
      },
    });
    isShow.value = true;
  };

  removePolygonById.value = (id: string) => {
    viewer.entities.removeById(id);
    isShow.value = false;
  };

  editStyle.value = (id: string) => {
    const entitiy = viewer.entities.getById(id) as any;
    entitiy.polygon.material = Cesium.Color.YELLOW;
  };

  removeAll.value = () => {
    viewer.entities.removeAll();
    isShow.value = false;
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
