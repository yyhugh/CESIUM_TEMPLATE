import apis from "@/apis";

/**
 * 登录页请求图形验证码
 */
export async function getVerifyImg() {
  await apis.getVerifyImg();
}
