<template>
  <div class="v-admin">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/cesium">Cesium</router-link>
    </nav>
    <router-view />
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
  display: flex;
  flex-direction: column;
  & > nav {
    padding: 30px;
    & > a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
}
</style>
