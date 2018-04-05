const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: ['./src/app.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.pug$/,
      loader: ['html-loader', 'pug-html-loader']
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      loader: ['style-loader', 'css-loader?soureMap', 'sass-loader']
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3000,
    open: true,
    hot: true,
    inline: true,
    stats: {
      colors: true,
      chunks: true
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Image Filter',
      hash: true,
      template: './src/index.pug'
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
}