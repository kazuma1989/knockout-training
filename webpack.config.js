const { readdirSync, statSync } = require('fs');
const { optimize: { CommonsChunkPlugin } } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const { exclude } = require('./build.json');
const pages = readdirSync('./src')
  .filter(file => exclude.indexOf(file) === -1)
  .filter(file => statSync(`./src/${file}`).isDirectory());

module.exports = {
  entry: Object.assign(
    {
      vendor: [
        'es5-polyfill',
        'jquery',
        'knockout',
      ],
    },
    ...pages.map(page => ({
      [page]: `${__dirname}/src/${page}/script.js`
    }))
  ),
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].[chunkhash:8].js'
  },
  module: {
    loaders: [
      {
        test: /\.hbs$/,
        loader: 'handlebars',
      },
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
      },
    ]
  },
  // devtool: 'cheap-module-eval-source-map',
  devServer: {
    open: true,
    compress: true,
    // Use disableHostCheck because host config does not work
    // host: process.env.HOST || '0.0.0.0',
    disableHostCheck: true,
  },
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new CleanWebpackPlugin(['dist'])
  ].concat(pages.map(page =>
    new HtmlWebpackPlugin({
      filename: `${page}.html`,
      template: `${__dirname}/src/${page}/view.hbs`,
      chunks: [
        'manifest',
        'vendor',
        page
      ]
    })
  )),
};
