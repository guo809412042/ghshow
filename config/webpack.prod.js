/* eslint-disable import/no-extraneous-dependencies */
const cssnano = require('cssnano');
const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const baseConfig = require('./webpack.base');
const pkg = require('../package.json');

const prodConfig = {
  output: {
    library: pkg.frontname,
    libraryTarget: 'window',
  },
  mode: 'production',
  plugins: [
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'vendors',
          chunks: 'all',
          minChunks: 2,
        },
        react: {
          test: /(react|react-dom)/,
          name: 'react',
          chunks: 'all',
        },
      },
    },
  },
};

module.exports = merge(baseConfig, prodConfig);
