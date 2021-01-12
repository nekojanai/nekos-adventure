const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: '::PROJECTO::',
      favicon: 'favicon.ico'
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    inline: true,
    contentBase: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 9000,
    host: '0.0.0.0'
  },
  module: {
    rules: [
      {
        test: /.(mjs|js|mts|ts|jsx|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          },
          {
            loader: 'ts-loader'
          }
        ]
      }, {
      test: /.(scss|css)$/,
      use: [
        { loader: "style-loader" },
        { loader: "css-loader" },
        { loader: "postcss-loader" },
        { loader: "sass-loader"}
      ]
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
}