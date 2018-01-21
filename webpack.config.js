const { readdirSync, statSync } = require('fs');
const { optimize: { CommonsChunkPlugin } } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./build.config');

const isProduction = process.env.NODE_ENV === 'production';

const srcDir = `${__dirname}/${config.path.src}`;
const distDir = `${__dirname}/${config.path.dist}`;
const pages = readdirSync(srcDir)
  .filter(file => config.page.exclude.indexOf(file) === -1)
  .filter(file => statSync(`${srcDir}/${file}`).isDirectory());

module.exports = {
  entry: Object.assign(
    {
      vendor: `${srcDir}/vendor.js`,
    },
    ...pages.map(page => ({
      [page]: `${srcDir}/${page}/main.js`
    }))
  ),
  output: {
    path: distDir,
    filename: '[name].[chunkhash:8].js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          'style-loader',
          'css-loader?modules'
        ]
      },
      {
        // https://github.com/webpack-contrib/less-loader/issues/51
        // https://github.com/survivejs/react-boilerplate/issues/1#issuecomment-217727545
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?sourceMap!less-loader?sourceMap',
        ),
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        loader: 'file-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader',
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
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
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  devServer: {
    open: true,
    compress: true,
    proxy: config.proxy,
    // Expose the dev server to the internet
    host: process.env.HOST || '0.0.0.0',
    disableHostCheck: true,
  },
  plugins: [
    new ExtractTextPlugin('[name].[contenthash:8].css'),
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new CopyWebpackPlugin(config.copy.map(path => `${srcDir}/${path}`)),
  ].concat(
    isProduction ? [ new CleanWebpackPlugin([`${distDir}/*.*`]) ] : []
  ).concat(pages.map(page =>
    new HtmlWebpackPlugin({
      filename: `${page}.html`,
      template: `${srcDir}/${page}/main.hbs`,
      chunks: [
        'manifest',
        'vendor',
        page
      ]
    })
  )),
};
