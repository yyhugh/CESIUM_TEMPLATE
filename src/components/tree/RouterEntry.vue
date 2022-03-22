<template>
  <div class="router-entry">
    <el-cascader v-model="selected" :options="options" @change="change" />
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, onMounted } from "vue";
import { ApplicationContext } from "@/application";

interface IOptions {
  label: any;
  value: any;
  children?: Array<IOptions>;
}

const context = ApplicationContext.current;
const options = reactive<Array<IOptions>>([]);
const router = reactive(context.router);

// 当前路由自动选中
const selected = ref<Array<string>>([]);

// 遍历路由配置
const { routes } = router.options;
for (let i = 0, l = routes.length; i < l; i++) {
  try {
    const route = routes[i];
    if (route.path === "/") {
      continue;
    }
    if (!route.meta?.isNav) {
      continue;
    }
    const children: Array<IOptions> = [];
    route.children?.forEach((item) => {
      children.push({
        label: item.name,
        value: item.name,
      });
    });
    options.push({
      label: route.name,
      value: route.name,
      children,
    });
  } catch (error) {
    console.error(error);
  }
}

function change(relative: Array<string>) {
  let path = "";
  relative.forEach((level) => {
    path += `/${level}`;
  });
  router.push({
    path,
  });
}

onMounted(() => {
  try {
    selected.value = router.currentRoute.path.split("/").filter((v) => v);
  } catch (error) {
    console.error("[RouterEntry cascader]: 当前路由自动选中逻辑异常！", error);
  }
});
</script>

<style lang="scss" scoped></style>
