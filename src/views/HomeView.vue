<template>
  <div class="home">
    <img v-previewer alt="Vue logo" src="~assets/logo.png" />
    <div class="count">
      <button @click="setCount('minus')">-</button>
      <span>{{ count }}</span>
      <button @click="setCount('add')">+</button>
    </div>
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <el-button type="primary">Primary</el-button>
  </div>
</template>

<script lang="ts" setup>
import { HelloWorld } from "@/components";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

// 响应式
const count = computed(() => store.getters["counter/getCount"]);

function setCount(type: "add" | "minus") {
  if (type === "add") {
    store.dispatch("counter/setCount", "add");
  } else {
    store.dispatch("counter/setCount", "minus");
  }
}
</script>

<style lang="scss" scoped>
.count {
  display: flex;
  justify-content: center;
  align-items: center;
  button {
    width: 30px;
    height: 30px;
    font-size: 20px;
  }
  span {
    width: 30px;
    height: 30px;
    line-height: 30px;
    color: $myColor;
  }
}
</style>
