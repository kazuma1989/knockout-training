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
  devServer: {
    contentBase: `${__dirname}/dist`,
    // Use disableHostCheck because host config does not work
    // host: process.env.HOST || '0.0.0.0',
    disableHostCheck: true,
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].[chunkhash:8].js'
  },
  module: {
    loaders: [
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
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
      filename: 'index.html',
      template: `${__dirname}/public/index.hbs`,
      chunks: ['manifest', 'vendor', 'index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'another.html',
      template: `${__dirname}/public/another.hbs`,
      chunks: ['manifest', 'vendor', 'another'],
    }),
  ],
  resolve: {
    extensions: ['', '.js']
  }
};
