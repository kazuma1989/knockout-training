const { optimize: { CommonsChunkPlugin } } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    vendor: [
      'es5-polyfill',
      'jquery',
      'knockout',
    ],
    index: `${__dirname}/src/index.js`,
    another: `${__dirname}/src/another.js`,
  },
  devtool: 'inline-source-map',
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].[chunkhash:8].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query:{
          presets: ['env'],
          plugins: [
            // Use import/export syntax with IE8
            'transform-es2015-modules-commonjs',
            'transform-es3-modules-literals',

            // Use any names as members or properties with IE8
            'transform-es3-member-expression-literals',
            'transform-es3-property-literals',

            // Fix bugs in IE8
            'transform-jscript',
          ]
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['manifest', 'vendor', 'index'],
      filename: 'index.html',
      template: `${__dirname}/public/base.ejs`,
      vars: {
        title: 'Knockout.js app',
        content: './index',
      },
    }),
    new HtmlWebpackPlugin({
      inject: true,
      chunks: ['manifest', 'vendor', 'another'],
      filename: 'another.html',
      // template: `${__dirname}/public/another.html`,
    }),
  ],
  resolve: {
    extensions: ['', '.js']
  }
};
