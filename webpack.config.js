const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: path.resolve(__dirname, 'test/browser/all-tests.js'),
  output: {
    filename: 'identifiers.test.bundle.js',
    path: path.resolve(__dirname, '.browser-test')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    // use a different tsconfig that does not generate declarations
    plugins: [new TsconfigPathsPlugin({configFile: path.resolve(__dirname, 'test/tsconfig.json')})]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};