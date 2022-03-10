<template>
  <div class="v-admin">
    <nav>
      <router-link to="/example1">Cesium1</router-link> |
      <router-link to="/example2">Cesium2</router-link>
    </nav>
    <section>
      <router-view />
    </section>
  </div>
</template>

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
