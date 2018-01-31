const { readdirSync, statSync } = require('fs');
const { resolve } = require('path');
const { optimize: { CommonsChunkPlugin } } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// Frequently changed values are seen in another config file.
const config = require('./build.config');

// Detect production mode.
const isProduction = process.env.NODE_ENV === 'production';

// Set up src and dist dirs.
const srcDir = resolve(__dirname, config.path.src);
const distDir = resolve(__dirname, config.path.dist);

// Use directories in src as page names, except for excluded names.
const pages = readdirSync(srcDir)
  .filter(file => config.page.exclude.indexOf(file) === -1)
  .filter(file => statSync(resolve(srcDir, file)).isDirectory());

// Construct Webpack config.
module.exports = {
  // Entries.
  // These JS and their dependencies are bundled into each JS.
  entry: Object.assign({
      vendor: resolve(srcDir, config.entry.vendor)
    },
    ...pages.map(page => ({
      [page]: [
        resolve(srcDir, config.entry.page.common),
        resolve(srcDir, page, 'main.js')
      ]
    }))
  ),

  // Outputs.
  // Where to publish built files.
  output: {
    path: distDir,
    filename: '[name].[chunkhash:8].js'
  },

  // Modules.
  // Each loader for any extensions is used to understand "import 'foo.someext'".
  module: {
    loaders: [{
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
        query: {
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

  // Devtool.
  // Define source map setting.
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',

  // Dev server.
  // Configure dev server behavior, which does not affect the production build.
  devServer: {
    compress: true,
    proxy: config.proxy,

    // Expose the dev server to the internet by following 2 config.
    host: process.env.HOST || '0.0.0.0',
    disableHostCheck: true,
  },

  // Plugins.
  // Define behaviors other than the loaders.
  plugins: [
    // Extract CSS from JS to make separate CSS files.
    new ExtractTextPlugin('[name].[contenthash:8].css'),
    // Bundle common JS files into "chunks" (bundled JS other than main.js).
    new CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    // Copy static assets to dist.
    new CopyWebpackPlugin(config.copyFrom.map(path => resolve(srcDir, path))),
  ].concat(
    isProduction ? [
      // Clean up dist contents.
      new CleanWebpackPlugin([resolve(distDir, '*.*')])
    ] : [],
    // From main.hbs, generate a HTML for each page containing proper "script" tags.
    pages.map(page =>
      new HtmlWebpackPlugin({
        filename: page + '.html',
        template: resolve(srcDir, page, 'main.hbs'),
        chunks: [
          'manifest',
          'vendor',
          page
        ]
      })
    )
  ),
};
