const webpack = require('webpack');
const path = require("path");

module.exports = {
  entry: './client/js/app.js',
  output: {
    path: path.resolve(__dirname, 'build/'),
    filename: 'app.bundle.js',
    sourceMapFilename: '[file].map'
  },
  devtool: 'source-map',
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      }
    ],
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
    ]
  },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     compress: {
  //         warnings: false,
  //     },
  //     output: {
  //         comments: false,
  //     },
  //   }),
  // ]
}