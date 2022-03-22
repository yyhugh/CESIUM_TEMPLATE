<template>
  <div class="page-404">
    <div class="main">
      <p class="title">4<span class="icon-404">0</span>4</p>
      <p class="message">哎呀...您访问的页面不存在</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-404 {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  .main {
    transform: translateY(-50px);
    width: 700px;
    .title {
      height: 260px;
      line-height: 260px;
      text-align: center;
      font-size: 240px;
      font-weight: 700;
      color: #19be6b;
      .icon-404 {
        display: inline-block;
        font-size: 230px;
        color: #19be6b;
        animation: icon-404 3s ease 0s infinite alternate;
      }
    }
    .message {
      display: block;
      font-size: 30px;
      font-weight: 500;
      text-align: center;
      letter-spacing: 4px;
      color: #dddde2;
    }
  }
}
@keyframes icon-404 {
  0% {
    transform: rotateZ(0deg);
  }
  20% {
    transform: rotateZ(-60deg);
  }
  40% {
    transform: rotateZ(-10deg);
  }
  60% {
    transform: rotateZ(50deg);
  }
  80% {
    transform: rotateZ(-20deg);
  }
  100% {
    transform: rotateZ(0deg);
  }
}
</style>
