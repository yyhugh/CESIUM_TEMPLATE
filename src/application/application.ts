import { ApplicationContext } from "./context";
import { createApp } from "vue";

// vuex
import { createStore } from "vuex";
import store from "../store";

// router
import { createRouter, createWebHistory } from "vue-router";
import routes from "../router";

// 全局指令
import directives from "../common/directives";

// 根组件
import App from "../views/App.vue";

// UI框架
import ElementPlus from "element-plus";
import "@/styles/theme/element.scss";

/**
 * 应用程序
 */
export class Application {
  /**
   * 单实例
   */
  private static _instance: Application;

  /**
   * 当前应用程序上下文
   */
  private applicationContext!: ApplicationContext;

  /**
   * 访问单实例
   */
  public static get instance() {
    if (!this._instance) {
      this._instance = new Application();
    }
    return this._instance;
  }

  /**
   * 启动应用程序
   */
  public async start(context: ApplicationContext): Promise<void> {
    // 上下文
    this.applicationContext = context;

    // 读取缓存
    this.cacheSaveToContext();

    // 创建app
    const app = createApp(App);

    // 批量注册全局指令
    const keys = Object.keys(directives);
    keys.forEach((key) => app.directive(key, directives[key]));

    // 相关依赖初始化
    const store = this.initStore();
    const router = this.initRouter();

    // 使用中间件
    app.use(store).use(router).use(ElementPlus);

    // 挂载到视图
    app.mount("#app");
  }

  /**
   * 初始化状态仓库
   */
  private initStore() {
    return createStore({
      modules: store,
    });
  }

  /**
   * 初始化路由
   */
  private initRouter() {
    const router = createRouter({
      history: createWebHistory(process.env.BASE_URL),
      routes,
    });

    // 路由守卫
    router.beforeEach((to, from, next) => {
      next();
    });

    return router;
  }

  /**
   * 读取缓存并存入上下文中
   */
  private cacheSaveToContext(): void {
    // TODO
  }
}
