import { RouteRecordRaw } from "vue-router";
import { rootRedirect, redirect } from "./redirect";

const part1 = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13"];
const part2 = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11"];
const part3 = ["C1"];

/**
 * 页面路由配置
 * ---
 * 定制特性
 * @param meta.auth `string` 权限码。可选项，需要权限校验就配置。
 * @param meta.isNav `boolean` 用于导航列表渲染。可选项，未配置则视为隐藏路由。
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: rootRedirect,
  },
  {
    name: "part3",
    path: "/part3",
    meta: {
      isNav: true,
    },
    component: () => import("@/views/App.vue"),
    redirect,
    children: [
      ...part3
        .map((v) => ({
          path: v,
          name: `part3-${v}`,
          component: () => import(`@/views/part3/${v}.vue`),
        }))
        .reverse(),
    ],
  },
  {
    name: "part2",
    path: "/part2",
    meta: {
      isNav: true,
    },
    component: () => import("@/views/App.vue"),
    redirect,
    children: [
      ...part2
        .map((v) => ({
          path: v,
          name: `part2-${v}`,
          component: () => import(`@/views/part2/${v}.vue`),
        }))
        .reverse(),
    ],
  },
  {
    name: "part1",
    path: "/part1",
    meta: {
      isNav: true,
    },
    component: () => import("@/views/App.vue"),
    redirect,
    children: [
      ...part1
        .map((v) => ({
          path: v,
          name: `part1-${v}`,
          component: () => import(`@/views/part1/${v}.vue`),
        }))
        .reverse(),
    ],
  },
  {
    name: "404",
    path: "/404",
    component: () => import("@/views/errors/NoFound.vue"),
  },
];

export default routes;
