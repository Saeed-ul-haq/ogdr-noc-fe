const { posix } = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const notifier = require('node-notifier')
const merge = require('webpack-merge')

const packageInfo = require('./package.json')
const baseConfig = require('./webpack.base')
const proxyConfig = require('./dev-proxy')
const CONFIG = {
  port: 8000,
  host: '0.0.0.0',
}

const sendNotifications = (severity, errors) => {
  if (severity === 'error') {
    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageInfo.name,
      message: `${severity}: ${error.name}`,
      subtitle: filename || '',
    })
  }
}

baseConfig.module.rules.find(
  rule => rule.loader === 'babel-loader',
).options.cacheDirectory = true
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'cheap-module-source-map',

  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js',

    /**
     * TODO: this is a temporary fix for resolve bugs caused by webpack hot reload in web worker.
     * see this for more detail: https://github.com/webpack/webpack/issues/6642
     */
    globalObject: 'this',
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.s(a|c)ss$/i,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify('/cesium'),
      ...require(`./build-profile/gismap.js`),
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true,
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          `Your application is running here: http://${CONFIG.host}:${CONFIG.port}`,
        ],
      },
      onErrors: sendNotifications,
    }),
  ],

  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: posix.join(baseConfig.output.publicPath, 'index.html'),
        },
      ],
    },
    hot: true,
    contentBase: false,
    compress: true,
    disableHostCheck: true,
    host: CONFIG.host,
    port: CONFIG.port,
    overlay: true,
    publicPath: baseConfig.output.publicPath,
    quiet: true,
    proxy: proxyConfig,
  },
})
