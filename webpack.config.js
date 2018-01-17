const { readdirSync, statSync } = require('fs');
const { optimize: { CommonsChunkPlugin } } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const config = require('./build.config.json');

const srcDir = `${__dirname}/${config.path.src}`;
const distDir = `${__dirname}/${config.path.dist}`;
const pages = readdirSync(srcDir)
  .filter(file => config.page.exclude.indexOf(file) === -1)
  .filter(file => statSync(`${srcDir}/${file}`).isDirectory());

module.exports = {
  entry: Object.assign(
    {
      vendor: config.entry.vendor,
    },
    ...pages.map(page => ({
      [page]: `${srcDir}/${page}/script.js`
    }))
  ),
  output: {
    path: distDir,
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
  devtool: config.devtool,
  devServer: Object.assign({
    // Use disableHostCheck because host config does not work
    // host: process.env.HOST || '0.0.0.0',
    disableHostCheck: true,
  }, config.devServer),
  plugins: [
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new CleanWebpackPlugin([distDir])
  ].concat(pages.map(page =>
    new HtmlWebpackPlugin({
      filename: `${page}.html`,
      template: `${srcDir}/${page}/view.hbs`,
      chunks: [
        'manifest',
        'vendor',
        page
      ]
    })
  )),
};
