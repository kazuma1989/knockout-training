const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: __dirname + '/src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
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
            'transform-es2015-modules-commonjs',
            'transform-es3-modules-literals',
          ]
        }
      },
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          plugins: [
            'transform-es3-member-expression-literals',
            'transform-es3-property-literals',
            'transform-jscript',
          ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: __dirname + '/public/index.html'
    }),
  ],
  resolve: {
    extensions: ['', '.js']
  }
};
