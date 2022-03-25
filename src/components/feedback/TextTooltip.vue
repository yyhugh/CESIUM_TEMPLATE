<template>
  <transition name="bounce">
    <div class="tooltip" v-show="props.show" ref="tooltipRef" :style="{ zIndex: props.zIndex }" @click="click"></div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, getCurrentInstance, defineEmits } from "vue";
import { AnchorUtil } from "@/common/utils";

const tooltipRef = ref();
const props = defineProps({
  show: Boolean,
  width: Number,
  height: Number,
  offsetX: Number,
  offsetY: Number,
  anchor: Object,
  zIndex: Number,
});
const config = computed(() => ({
  width: props.width || 206,
  height: props.height || 120,
  offsetX: props.offsetX || 0,
  offsetY: props.offsetY || 0,
  anchor: props.anchor || AnchorUtil.Anchor.CENTER_BOTTOM,
  zIndex: props.zIndex || 1,
}));
const vm = getCurrentInstance();
function setPosition(origin: { x: number; y: number }) {
  const offset = AnchorUtil.getOffset(config.value.anchor as number, config.value.width, config.value.height);
  (tooltipRef.value as HTMLElement).style.top = origin.y + offset.y + config.value.offsetY + "px";
  (tooltipRef.value as HTMLElement).style.left = origin.x + offset.x + config.value.offsetX + "px";
}
function click() {
  vm?.emit("click");
}
defineExpose({
  setPosition,
});
defineEmits(["click"]);
</script>

<style lang="scss" scoped>
.tooltip {
  position: fixed;
  top: 0;
  left: 0;
  padding: 18px;
  box-sizing: border-box;
  width: 206px;
  height: 120px;
  border-radius: 4px;
  cursor: pointer;
  background: url("~assets/grain.png") no-repeat top right, linear-gradient(157deg, #3598f1, #4766e9);
  box-shadow: 0px 0px 12px 0px rgba(4, 7, 35, 0.2);
  &::after {
    position: absolute;
    z-index: -1;
    bottom: 0;
    left: 50%;
    content: "";
    width: 11px;
    height: 11px;
    border-radius: 2px;
    transform: translate(-50%, 50%) rotate(-45deg);
    background-color: #4371eb;
  }
  &:hover {
    z-index: 99999 !important;
  }
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-out 0.2s reverse ease-in-out;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
</style>
