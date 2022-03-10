import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/example1",
  },
  {
    path: "/example1",
    name: "example1",
    component: () => import("@/views/Example1.vue"),
  },
  {
    path: "/example2",
    name: "example2",
    component: () => import("@/views/Example2.vue"),
  },
];

export default routes;
