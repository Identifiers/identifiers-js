const path = require("path");

module.exports = [{
  mode: "production",
  entry: path.resolve(__dirname, "src/index.ts"),
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
  }
},
{
  mode: "development",
  entry: path.resolve(__dirname, "test/all-tests.js"),
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
    path: path.resolve(__dirname, "browser-test")
  }
}];