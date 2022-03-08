# 🚀 BIG SCREEN

基于 vue 官方脚手架 [@vue/cli 文档](https://cli.vuejs.org/zh/guide/installation.html)

## 🌈 @vue/cli 引导选项

Vue CLI v5.0.1
- ❔Please pick a preset: `Manually select features`
- ❔Check the features needed for your project: `Babel, TS, Router, Vuex, CSS Pre-processors, Linter`
- ❔Choose a version of Vue.js that you want to start the project with `3.x`
- ❔Use class-style component syntax? `Yes`
- ❔Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? `Yes`
- ❔Use history mode for router? (Requires proper server setup for index fallback in production) `Yes`
- ❔Pick a CSS pre-processor (PostCSS, Autoprefixer and CSS Modules are supported by default): `Sass/SCSS (with dart-sass)`
- ❔Pick a linter / formatter config: `Prettier`
- ❔Pick additional lint features: `Lint on save`
- ❔Where do you prefer placing config for Babel, ESLint, etc.? `In dedicated config files`
- ❔Save this as a preset for future projects?

## 🏗 根目录添加 vue.config.js 修改 webpack 配置

**📦 依赖包说明**

| 开发依赖                              | 版本  | 作用                                     |
| ------------------------------------- | ----- | ---------------------------------------- |
| cross-env                             | 7.0.3 | 跨平台设置环境变量`process.env.NODE_ENV` |
| glob                                  | 7.2.0 | 扫描磁盘文件，获取匹配文件列表           |
| style-resources-loader                | 1.5.0 | 自动化导入文件，用于全局变量、mixin      |
| vue-cli-plugin-style-resources-loader | 0.1.5 | 与 style-resources-loader 配合使用       |
| webpack-bundle-analyzer               | 4.5.0 | 打包结果可视化分析                       |

## 🏃 Scripts

| scripts | 作用     |
| ------- | -------- |
| dev     | 开发环境 |
| build   | 生产环境 |

✨ 推荐包管理工具 [yarn](https://classic.yarnpkg.com/zh-Hans/)，快速安装`npm i -g yarn`
