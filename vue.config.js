const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

// gzip压缩  webpack 4.x 对应 6.x版本
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
// 代码压缩
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// 引入压缩插件  cnpm i terser-webpack-plugin@4.2.3 --save-dev
// const TerserPlugin = require("terser-webpack-plugin");
// 打包进度
// const ProgressBarPlugin = require("progress-bar-webpack-plugin");

module.exports = {
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  publicPath: process.env.VUE_APP_PUBLIC_PATH || "/",
  productionSourceMap: false,
  // eslint-disable-next-line no-unused-vars
  configureWebpack: (config) => {
    const plugins = [];
    // 生产环境相关配置
    if (IS_PROD) {
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path][base].gz",
          algorithm: "gzip",
          minRatio: 0.99,
          test: productionGzipExtensions,
          deleteOriginalAssets: false,
        })
      );
      plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            // 删除注释
            output: {
              comments: false,
            },
            // 删除console debugger
            compress: {
              drop_debugger: true,
              drop_console: true, // console
              pure_funcs: ["console.log"], // 移除console
            },
            // 删除警告
            warnings: false,
          },
          sourceMap: false,
          parallel: true, //使用多进程并行运行来提高构建速度。默认并发运行数：os.cpus().length - 1。
        })
      );

      // plugins.push(new ProgressBarPlugin());

      // plugins.push(
      //   new TerserPlugin({
      //     cache: true,
      //     sourceMap: false,
      //     // 多进程
      //     parallel: true,
      //     terserOptions: {
      //       ecma: undefined,
      //       warnings: false,
      //       parse: {},
      //       compress: {
      //         drop_console: true,
      //         drop_debugger: false,
      //         pure_funcs: ["console.log"], // 移除console
      //       },
      //     },
      //   })
      // );
    }
    // config.plugins = [...config.plugins, ...plugins];
  },
  chainWebpack: (config) => {
    // 添加别名
    config.resolve.alias
      // .set("vue$", "vue/dist/vue.esm.js")
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets"))
      .set("@packages", resolve("packages"));
    // .set("@scss", resolve("src/assets/scss"))
    // .set("@components", resolve("src/components"))
    // .set("@plugins", resolve("src/plugins"))
    // .set("@views", resolve("src/views"))
    // .set("@router", resolve("src/router"))
    // .set("@store", resolve("src/store"))
    // .set("@layouts", resolve("src/layouts"))
    // .set("@static", resolve("src/static"));

    // Markdown Loader
    config.module
      .rule("md")
      .test(/\.md/)
      .use("vue-loader")
      .loader("vue-loader")
      .end()
      .use("vue-markdown-loader")
      .loader("vue-markdown-loader/lib/markdown-compiler")
      .options({
        raw: true,
      });

    if (IS_PROD) {
      // config.optimization.delete("splitChunks");

      // 打包分析
      config.plugin("webpack-report").use(BundleAnalyzerPlugin, [
        {
          analyzerMode: "static",
        },
      ]);
    }
  },
};
