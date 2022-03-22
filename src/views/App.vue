<template>
  <div class="v-app">
    <router-view />
    <RouterEntry class="entry"></RouterEntry>
    <AppLoading :show="appLoading"></AppLoading>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { AppLoading, RouterEntry } from "@/components";

const store = useStore();
const appLoading = computed(() => store.getters["loading/getAppLoading"]);
</script>

<style lang="scss" scoped>
.v-app {
  height: 100%;
  background-color: #000;
  .entry {
    position: fixed;
    top: 15px;
    left: 15px;
  }
}
</style>
