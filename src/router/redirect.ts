import { RouteLocation } from "vue-router";
import { ApplicationContext } from "@/application";

const noFoundPath = "/404";

export function rootRedirect(): string {
  let path = "";
  try {
    const context = ApplicationContext.current;
    const { routes } = context.router.options;
    for (let i = 0, l = routes.length; i < l; i++) {
      const route = routes[i];
      if (route.path !== "/") {
        path = route.path;
        break;
      }
    }
    if (!path) {
      throw Error("请检查路由配置！");
    }
  } catch (error) {
    console.error("[rootRedirect 路由重定向逻辑异常]: ", error);
    path = noFoundPath;
  }
  return path;
}

export function redirect(to: RouteLocation): string {
  try {
    const { path, matched } = to;
    return `${path}/${matched[0].children[0].path}`.replace("//", "/");
  } catch (error) {
    console.error("[redirect 路由重定向逻辑异常]: ", error);
    return noFoundPath;
  }
}
