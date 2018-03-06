const WebpackTool = require('webpack-tool');

module.exports = async config => {
  const webpackTool = new WebpackTool({
    view: false,
    isServerBuild: false
  });

  // @todo 检测错误
  // @todo 显示
  return new Promise((res, rej) => {
    webpackTool.build(config, (compiler, compilation) => {
      res();
    })
  })
}
