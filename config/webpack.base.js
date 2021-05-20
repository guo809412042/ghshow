/*
 * @Description:
 * @Author: ssssslf
 * @Date: 2020-04-21 16:53:43
 * @LastEditTime: 2020-07-27 15:50:41
 * @LastEditors: Please set LastEditors
 */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebpackBar = require('webpackbar');
const config = require('./index');

const projectRoot = process.cwd();

module.exports = {
  entry: {
    index: path.join(projectRoot, './src/entry.js'),
  },
  output: {
    publicPath: config.target,
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[hash:8].js',
  },
  module: {
    rules: [{
      test: /\.(js|jsx)/,
      use: ['thread-loader', 'babel-loader?cacheDirectory',
        // 'eslint-loader'
      ],
    },
    {
      test: /\.css/,
      use: [MiniCssExtractPlugin.loader, 'css-loader'],
    },
    {
      test: /\.less/,
      include: /node_modules|antd\.less/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
            modifyVars: {
              'primary-color': '#FF7F50',
              'link-color': '#FF7F50',
              'font-size-base': '13px',
              'border-radius-base': '4px',
            },
          },
        },
      ],
    },
    {
      test: /\.less/,
      exclude: /node_modules|antd\.less/,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
          },
        },
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            javascriptEnabled: true,
          },
        },
      ],
    },
    {
      test: /\.(png|jpg|jpeg|gif)/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: 10240,
          name: './img/[name]_[hash:8].[ext]',
        },
      }],
    },
    {
      test: /.(woff|woff2|eot|ttf|otf)$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name]_[hash:8].[ext]',
        },
      }],
    },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BUILD_ENV: JSON.stringify(process.env.BUILD_ENV),
      },
    }),
    new FriendlyErrorsWebpackPlugin(),
    new CleanWebpackPlugin(['dist/*'], {
      root: projectRoot,
    }),
    new HtmlWebpackPlugin({
      inlineSource: '.css$',
      template: path.join(projectRoot, './public/index.html'),
      filename: 'index.html',
      chunks: ['index', 'react', 'commons'],
      inject: true,
      minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: false,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false,
      },
      oss: config.host,
    }),
    new WebpackBar(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  stats: 'errors-only',
};
