<template>
  <div class="v-admin">
    <nav>
      <template v-for="item in list" :key="item.name">
        <router-link :to="item.path">{{ item.name }}</router-link> |
      </template>
    </nav>
    <section>
      <router-view />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { RouteRecordRaw } from "vue-router";
import { ApplicationContext } from "@/application";
const context = ApplicationContext.current;
const router = ref(context.router);
const { routes } = router.value.options;
const list = ref<Array<RouteRecordRaw>>([]);

routes.forEach((route) => {
  if (route.path !== "/") {
    list.value.push(route);
  }
});
</script>

<style lang="scss">
@import "@/styles/reset.scss";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.v-admin {
  height: 100%;
  background-color: #000;
  & > nav {
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    & > a {
      margin: 0 10px;
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
  & > section {
    height: calc(100% - 60px);
  }
}
</style>
