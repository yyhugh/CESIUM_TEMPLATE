<template>
  <div class="v-cesium" id="cesiumContainer"></div>
</template>

<script lang="ts" setup>
import "/node_modules/cesium/Build/Cesium/Widgets/widgets.css";
import * as Cesium from "cesium";
import { onMounted } from "vue";

onMounted(() => {
  new Cesium.Viewer("cesiumContainer");
});
</script>

<style lang="scss" scoped>
.v-cesium {
  height: 100%;
}
</style>
