const { resolve } = require('path')

const CopyWebpackPlugin = require('copy-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-tags-plugin')
// const webpack = require('webpack')

// if the size of resource is bigger than threshold,
// it will be splitted into additional file
// rather than bundle to javascript file
const resourceThreshold = 8192

module.exports = {
  entry: {
    app: ['@babel/polyfill', './src/index.js'],
  },

  output: {
    path: resolve(__dirname, './dist'),
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.bpmn$/,
        use: 'raw-loader',
      },
      {
        test: /\.jsx?$/i,
        exclude: /node_modules(?!(\/|\\)(@target-energysolutions|react-reflex))/,
        loader: 'babel-loader',
        options: {},
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: resourceThreshold,
          name: 'images/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
        loader: 'url-loader',
        options: {
          limit: resourceThreshold,
          name: 'media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/i,
        loader: 'url-loader',
        options: {
          limit: resourceThreshold,
          name: 'fonts/[name].[hash:8].[ext]',
        },
      },
    ],
  },

  resolveLoader: {
    alias: {
      worker: 'workerize-loader?name=js/[hash:8]',
    },
  },

  resolve: {
    modules: [resolve(__dirname, './src'), 'node_modules'],
    extensions: ['.mjs', '.js', '.jsx'],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, './static'),
          to: 'static',
        },

        {
          from: resolve(__dirname, './node_modules/cesium/Build/Cesium'),
          to: 'cesium',
        },
      ],
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      append: false,
      assets: ['cesium/Widgets/widgets.css', 'cesium/Cesium.js'],
    }),
  ],
  // externals: {
  //   cesium: 'Cesium',
  // },
}
