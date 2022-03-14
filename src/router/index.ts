import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/home",
    name: "home",
    component: () => import("@/views/HomeView.vue"),
  },
  {
    path: "/C1",
    name: "C1",
    component: () => import("@/views/C1.vue"),
  },
  {
    path: "/C2",
    name: "C2",
    component: () => import("@/views/C2.vue"),
  },
  {
    path: "/C3",
    name: "C3",
    component: () => import("@/views/C3.vue"),
  },
  {
    path: "/C4",
    name: "C4",
    component: () => import("@/views/C4.vue"),
  },
  {
    path: "/C5",
    name: "C5",
    component: () => import("@/views/C5.vue"),
  },
  {
    path: "/C6",
    name: "C6",
    component: () => import("@/views/C6.vue"),
  },
  {
    path: "/C7",
    name: "C7",
    component: () => import("@/views/C7.vue"),
  },
  {
    path: "/C8",
    name: "C8",
    component: () => import("@/views/C8.vue"),
  },
];

routes.unshift({
  path: "/",
  redirect: routes[0].path,
});

export default routes;
