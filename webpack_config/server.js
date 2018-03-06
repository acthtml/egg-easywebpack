const path = require('path');
const webpack = require('webpack-tool').webpack;
const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const baseConfig = require('./base');

module.exports = (env = 'local', options) => {
  let baseDir = options.baseDir;
  let config = merge(baseConfig(env, options), {
    entry: path.join(baseDir, 'app/web/entry_server.js'),
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(baseDir, 'app', 'view'),
      publicPath: options.client.publicPath
    },
    target: 'node',
    devtool: 'source-map',
    externals: nodeExternals({
      whitelist: [/\.css$/, /\.vue$/]
    }),
    plugins: [
      new webpack.DefinePlugin({
        'WEBPACK_ENTRY_TYPE': '"server"'
      }),
      new VueSSRServerPlugin()
    ]
  });

  if(env != 'local' && env == 'unittest'){
    delete config.devtool;
  }
  return config;
}
