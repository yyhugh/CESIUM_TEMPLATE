const { defineConfig } = require("@vue/cli-service");
const { resolve } = require("./build/utils");
const { devServer, alias, build: { bundleAnalyzer } } = require("./build/config");
const isProd = process.env.NODE_ENV === "production";

module.exports = defineConfig({
  transpileDependencies: true,
  // 合并配置
  configureWebpack: config => {
    // 打包结果可视化分析
    if (isProd && bundleAnalyzer) {
      const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
      config.plugins.push(new BundleAnalyzerPlugin());
    }
  },
  // 细粒度配置
  chainWebpack: config => {
    // 设置路径别名
    for (let k in alias) {
      config.resolve.alias.set(k, alias[k]);
    }

    // 处理cur文件
    config.module
      .rule("cur")
      .test(/\.cur$/)
      .use("url-loader")
      .loader("url-loader")
      .end();
  },
  pluginOptions: {
    // 配置scss全局变量
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [
        resolve("src/styles/variables/index.scss"),
        resolve("src/styles/mixins/index.scss"),
      ],
    },
  },
  devServer: {
    ...devServer,
  },
});
