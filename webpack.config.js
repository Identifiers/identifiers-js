const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: path.resolve(__dirname, "src/index.ts"),
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  output: {
    filename: "identifiers.bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
};