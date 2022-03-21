<template>
  <transition name="fade" v-show="props.show">
    <div class="loading">
      <div class="main">
        <img src="~assets/loading.svg" alt="" />
        <p>{{ props.text || "正在启动..." }}</p>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const props = defineProps({
  text: String,
  show: Boolean,
});
</script>

<style lang="scss" scoped>
$bgColor: #06111f;
$fontColor: #dedede;
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 1000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $bgColor;
  .main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    transform: translateY(-25px);
    img {
      width: 200px;
      height: 200px;
    }
    p {
      font-size: 32px;
      color: $fontColor;
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
