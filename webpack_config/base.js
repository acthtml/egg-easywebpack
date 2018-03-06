const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const ProgressBarPlugin = require("progress-bar-webpack-plugin");

module.exports = (env = "local", options) => {
  // @todo 根据服务器环境，动态的生成路径
  return {
    output: {
      filename: path.join("js", "[name].[hash].js")
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: "babel-loader" // 'babel-loader' is also a legal name to reference
            }
          ]
        },
        {
          test: /\.vue$/,
          exclude: /(node_modules|bower_components)/,
          exclude: /node_modules\/(?!vue-slider-component)/,
          loader: "vue-loader" // 'babel-loader' is also a legal name to reference
        },
        {
          test: /\.css$/,
          // loader: ['css-loader'],
          // extract text plugin有些问题
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              { loader: "css-loader", options: { importLoaders: 1 } },
              {
                loader: "postcss-loader",
                options: {
                  plugins: () => [
                    require('autoprefixer')()
                  ]
                }
              }
            ]
          })
        },
        {
          test: /\.(gif|jpg|png|svg)\??.*$/,
          loader: "url-loader?limit=1024&name=images/[name].[hash].[ext]"
        },
        {
          test: /\.(woff|eot|ttf)\??.*$/,
          loader: "url-loader?limit=1024&name=font/[name].[hash].[ext]"
        },
        {
          test: /\.(html|tpl)$/,
          loader: "html-loader?name=html/[name].[hash].[ext]"
        }
      ]
    },
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
        "@config$": path.join(options.baseDir, `app/web/config/config.${env}`),
        "~": path.join(options.baseDir, "app/web")
      }
    },
    plugins: [
      // new webpack.DefinePlugin({
      //   'process.env': {
      //     NODE_ENV: '"production"'
      //   }
      // }),
      new ExtractTextPlugin({
        filename: path.join("css", "[name].[contenthash].css")
      }),
      new ProgressBarPlugin()
    ]
  };
};
