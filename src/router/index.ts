import { RouteRecordRaw } from "vue-router";
import { rootRedirect, redirect } from "./redirect";
import App from "@/views/App.vue";

const cList = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13"];

/**
 * 页面路由配置
 * ---
 * 特性
 * meta.auth   权限码。可选项，需要权限校验就配置。
 * meta.isNav  用于导航列表渲染。可选项，未配置则视为隐藏路由。
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: rootRedirect,
  },
  {
    name: "part1",
    path: "/part1",
    meta: {
      isNav: true,
    },
    component: App,
    redirect,
    children: [
      ...cList.map((c) => ({
        path: c,
        name: c,
        component: () => import(`@/views/part1/${c}.vue`),
      })),
    ],
  },
  {
    name: "404",
    path: "/404",
    component: () => import("@/views/errors/NoFound.vue"),
  },
];

export default routes;
