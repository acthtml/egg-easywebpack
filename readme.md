# egg-easywebpack

提供[egg-vue-spa-ssr-boilderplate](https://github.com/acthtml/egg-vue-spa-ssr-boilerplate)
开箱即用的webpack配置。

## 特性

- 输出vue客户端、服务端的webpack配置。
- webpack配置支持服务端渲染。
- webpack配置支持HMR。
- 根据webpack配置，构建成静态文件。
- vue支持.vue。
- 根据eggjs的环境变量加载配置。

## 约定

1. vue所用架构的客户端和服务端入口分别为：
    - /app/web/entry_client.js
    - /app/web/entry_server.js
2. ssr所用的html template为：
    - /app/web/views/app.template.html
3. webpack编译的客户端静态产物在：
    - /public/static/
4. 通过`import '@config'`获取当前配置。会根据当前环境来获取配置。例如，当`EGG_SERVER_ENV=prod`
  时，实际获取的模块为`/app/web/config/config.prod.js`。这样做的目的时，根据环境，部署不
  同的版本。
5. 模块名前缀`~`指向的是前端根目录。例如`import '~/common'`，实际获取的模块为`/app/web/common`。


## 使用

1. 获取webpack配置。

```js
  const webpackConfig = require('egg-easywebpack');

  /**
   * 获取vue ssr项目的webpack配置。
   * @param  {String} type    配置类型:client或server
   * @param  {String} env     配置所在环境local/unittest/stage/prod
   * @param  {Object} options 选型，包含以下属性
   *                          - baseDir 站点根目录，默认 process.cwd()
   *                          - ip 代理ip
   *                          - port 代理端口
   *                          - enableHMR 开启热更新
   *                          - client 客户端产物配置
   *                            - publicPath output.publicPath
   *                            - path output.public.path
   * @return {Object}         webpack config
   */

  // 本地开发时的前后端配置，开启HMR。
  webpackConfig('client', 'local', {enableHMR: true});
  webpackConfig('server', 'local', {enableHMR: true});

  // 生产环境时的配置
  webpackConfig('client', 'prod', { client: {publicPath:'//cdn.example.com/'}})
  webpackConfig('server', 'prod', { client: {publicPath:'//cdn.example.com/'}})
```

2. 根据webpack配置，构建成静态文件。

- DIY形式。

```js
  const build = reqire('egg-easywebpack/build');
  build()
    .then(() => console.log('done'))
    .catche(e => console.log('error'));
```

- 命令形式。

```bash
  # package.json
  # "scripts": {
  #    "build": "easywebpack"
  # }
  eport EGG_SERVER_ENV=prod && npm run build
```

