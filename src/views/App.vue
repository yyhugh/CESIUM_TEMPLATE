<template>
  <div class="v-admin">
    <nav>
      <router-link to="/home">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/cesium">Cesium</router-link>
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
