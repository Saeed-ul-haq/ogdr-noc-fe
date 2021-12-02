const merge = require('webpack-merge')

const devConfig = require('./webpack.test')

devConfig.module.rules.find(
  rule => rule.loader === 'babel-loader',
).options.cacheDirectory = false

// delete css and sass loader in dev config
const cssLoaderIndex = devConfig.module.rules.indexOf(
  rule => rule.test.toString() === /\.css$/i.toString(),
)
devConfig.module.rules.splice(cssLoaderIndex, 1)
const sassLoaderIndex = devConfig.module.rules.indexOf(
  rule => rule.test.toString() === /\.s(a|c)ss$/i.toString(),
)
devConfig.module.rules.splice(sassLoaderIndex, 1)

module.exports = merge(devConfig, {
  mode: 'development',
  devtool: 'source-map',

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
              importLoaders: 1,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
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
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
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
})
