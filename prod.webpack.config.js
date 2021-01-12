const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  ],
  module: {
    rules: [{
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      include: [path.resolve(__dirname, 'src')],
      exclude: [/node_modules/]
    }, {
      test: /.(scss|css)$/,
      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader",
      }, {
        loader: "postcss-loader"
      }, {
        loader: "sass-loader",
      }]
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
}