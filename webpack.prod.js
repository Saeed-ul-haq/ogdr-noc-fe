const merge = require('webpack-merge')
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const safeParser = require('postcss-safe-parser')
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const CompressionPlugin = require('compression-webpack-plugin')

const baseConfig = require('./webpack.base')

module.exports = merge(baseConfig, {
  bail: true,
  mode: 'production',
  devtool: false,

  output: {
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].chunk.[chunkhash:8].js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          ExtractCssChunks.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.s(a|c)ss$/i,
        use: [
          ExtractCssChunks.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },

  plugins: [
    new ExtractCssChunks({
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[id].[hash:8].css',
      hot: false,
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
    }),

    // new CompressionPlugin({
    //   test: /\.(html|css|js|eot|ttf|woff|svg|txt)$/i,
    // }),
  ],

  optimization: {
    minimizer: [
      // new UglifyJsPlugin({
      //   cache: true,
      //   parallel: true,
      //   uglifyOptions: {
      //     compress: {
      //       warnings: false,
      //       comparisons: false,
      //     },
      //     output: {
      //       comments: false,
      //       ascii_only: false,
      //     },
      //   },
      // }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safeParser,
          discardComments: {
            removeAll: true,
          },
        },
      }),
    ],

    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'initial',
        },
        default: {
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    },

    runtimeChunk: {
      name: 'runtime',
    },
  },
})
