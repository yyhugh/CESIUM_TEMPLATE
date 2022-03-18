import { RouteRecordRaw } from "vue-router";

const cList = ["C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9", "C10", "C11", "C12", "C13"];

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: "/home",
  //   name: "home",
  //   component: () => import("@/views/HomeView.vue"),
  // },
  ...cList.map((c) => ({
    path: `/${c}`,
    name: c,
    component: () => import(`@/views/${c}.vue`),
  })),
];

routes.unshift({
  path: "/",
  redirect: routes[0].path,
});

export default routes;
