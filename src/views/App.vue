<template>
  <div class="v-app">
    <router-view />
    <AppLoading :show="appLoading"></AppLoading>
    <RouterEntry class="entry"></RouterEntry>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { RouteRecordRaw } from "vue-router";
import { ApplicationContext } from "@/application";
import { AppLoading, RouterEntry } from "@/components";

const context = ApplicationContext.current;
const store = useStore();
const appLoading = computed(() => store.getters["loading/getAppLoading"]);

const router = ref(context.router);
const { routes } = router.value.options;
const list = ref<Array<RouteRecordRaw>>([]);

routes.forEach((route) => {
  if (route.path !== "/") {
    list.value.push(route);
  }
});

function hide() {
  store.dispatch("loading/setAppLoading", false);
}

setTimeout(() => {
  hide();
}, 1000);
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
