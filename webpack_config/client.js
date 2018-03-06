const path = require('path');
const webpack = require('webpack-tool').webpack;
const merge = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const baseConfig = require('./base');

module.exports = (env = 'local', options) => {
  let baseDir = options.baseDir;
  let config = merge(baseConfig(env, options), {
    entry: {
      app: path.join(baseDir, 'app/web/entry_client.js'),
      vendor: [
        'vue',
        'vuex',
        'vue-router'
      ]
    },
    output: {
      publicPath: options.client.publicPath,
      path: options.client.path
    },
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        'WEBPACK_ENTRY_TYPE': '"client"'
      }),
      // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
      // 以便可以在之后正确注入异步 chunk。
      // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
      new webpack.optimize.CommonsChunkPlugin({
        name: "manifest",
        minChunks: Infinity
      }),
      // 此插件在输出目录中
      // 生成 `vue-ssr-client-manifest.json`。
      new VueSSRClientPlugin()
    ]
  });

  // 非开发模式添加压缩，和去除warning。
  if(env != 'local'){
    // 非开发模式去掉sourcemap
    if(env != 'unittest') delete config.devtool;

    // 进行压缩
    config = merge(config, {
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        // @todo webpack打包代码压缩
        new webpack.optimize.UglifyJsPlugin({
          minimize: true,
          compress: {
            warnings: false
          }
        })
      ]
    });
  }

  // 添加hmr
  if(env == 'local' && options.enableHMR){
    // 添加HMR
    // clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]
    // clientConfig.output.filename = '[name].js'
    config.entry.app = [`webpack-hot-middleware/client?path=//${options.ip}:${options.port}/__webpack_hmr&noInfo=false&reload=false&quiet=false`, config.entry.app]
    config.output.filename = '[name].js'
    config.plugins.push(
      // OccurenceOrderPlugin is needed for webpack 1.x only
      // new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      // Use NoErrorsPlugin for webpack 1.x
      new webpack.NoEmitOnErrorsPlugin()
    )
  }

  return config;
}
