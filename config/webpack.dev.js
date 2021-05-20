/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2019-11-21 20:29:22
 * @LastEditTime: 2021-04-27 17:58:42
 * @LastEditors: dongqi.zhao
 */
/* eslint-disable import/no-extraneous-dependencies */
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    host: '0.0.0.0',
    contentBase: './dist',
    hot: true,
    stats: 'errors-only',
    open: true,
    compress: true,
    progress: true,
    proxy: {
      // '/gh': {
      //   // 社区
      //   target: 'http://0.0.0.0:6090',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/gh': '',
      //   },
      // },
      '/': {
        // 产品管理·
        target: 'http://vcm.quvideo.vip',
        changeOrigin: true,
      },
    },
  },
  devtool: 'cheap-module-eval-source-map',
};

module.exports = merge(baseConfig, devConfig);
