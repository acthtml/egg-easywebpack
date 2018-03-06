#!/usr/bin/env node

/**
 * @fileOverview 构建静态文件
 */
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

const builder = require('./builder');
const webpackConfig = require('./webpack_config');
const env = process.env.EGG_SERVER_ENV || 'local';

async function run(){
  // console.log('build env:', env);
  // 1. clean
  await fs.emptyDir(path.join(process.cwd(), 'public', 'static'));
  // @todo clean the folders: /public/static and /app/view/

  // 2. build it.
  let webpackConfigList;
  let config;
  try{
    config = require(path.join(process.cwd(), `/config/config.${env}`));
  }catch(e){
    console.warn('没有指定当前环境的配置，所以采用默认配置。')
    config = {};
  }
  webpackConfigList = _.get(config, 'webpack.webpackConfigList', null);
  if(!webpackConfigList){
    webpackConfigList = [
      webpackConfig('client', env),
      webpackConfig('server', env)
    ];
  }
  await builder(webpackConfigList);
}

run();
