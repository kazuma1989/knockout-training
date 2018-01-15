const { optimize: { CommonsChunkPlugin } } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    new CommonsChunkPlugin({
      name: 'vendor',
    }),
    new CommonsChunkPlugin({
      name: 'manifest',
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      chunks: ['manifest', 'vendor', 'index'],
      filename: 'index.html',
      template: `${__dirname}/public/index.html`,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      hash: true,
      chunks: ['manifest', 'vendor', 'another'],
      filename: 'another.html',
      // template: `${__dirname}/public/another.html`,
    }),
  ],
  resolve: {
    extensions: ['', '.js']
  }
};
