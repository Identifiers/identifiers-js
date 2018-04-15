const path = require("path");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "test/browser/all-tests.js"),
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
    filename: "identifiers.test.bundle.js",
    path: path.resolve(__dirname, ".browser-test")
  }
};