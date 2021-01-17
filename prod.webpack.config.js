const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Ayahuasca',
      favicon: 'favicon.ico'
    }),
    new CopyPlugin({
      patterns: [
        './src/assets'
      ]
    })
  ],
  module: {
    rules: [{
      test: /\.(png|jpe?g|gif)$/i,
      use: [
        { loader: 'file-loader' }
      ]
    }, {
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      include: [path.resolve(__dirname, 'src')],
      exclude: [/node_modules/]
    }, {
      test: /.(scss|css)$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "postcss-loader" },
        { loader: "sass-loader" }
      ]
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
}