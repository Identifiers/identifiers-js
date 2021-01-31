const path = require('path');
const tsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, '../src/index.ts'),
  externals: [
    'msgpackr/stream.js',
    'msgpackr/sync'
  ],
  output: {
    library: 'ID',
    filename: 'identifiers.bundle.js',
    path: path.resolve(__dirname, '../dist')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    // use a different tsconfig that does not generate declarations
    plugins: [new tsConfigPathsPlugin({configFile: path.resolve(__dirname, 'tsconfig-webpack.json')})],
    fallback: {
      'stream': false
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
};