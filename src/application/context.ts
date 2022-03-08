import { IMainCredential } from "@/models";

/**
 * 应用程序上下文
 */
export class ApplicationContext {
  /**
   * 单实例
   */
  private static _instance: ApplicationContext;

  /**
   * 访问单实例
   */
  public static get current() {
    if (!this._instance) {
      this._instance = new ApplicationContext();
    }
    return this._instance;
  }

  /**
   * 主凭证
   */
  public mainCredential!: IMainCredential;
}
