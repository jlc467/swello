/*eslint-disable */

'use strict';


const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');


const loaders = [
  { test: /\.css$/, loaders: ['style', 'css?modules&localIdentName=[local]---[hash:base64:5]'], include: [path.resolve('src')], exclude: [path.resolve('src/global-css')] },
  { test: /\.css$/, loaders: ['style', 'css'], include: [path.resolve('src/global-css')] },
  { test: /\.json$/, loader: 'json', include: [path.resolve('src')] },
  { test: /\.js$/, loader: 'babel', include: [path.resolve('src')] },
  { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]', include: [path.resolve('src')] }
];


const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    MAP_TOKEN: JSON.stringify(process.env.MAP_TOKEN),
    FORECAST_API: JSON.stringify(process.env.FORECAST_API),
    WUNDERGROUND_KEY: JSON.stringify(process.env.WUNDERGROUND_KEY)
  }
});


const resolve = { extensions: ['', '.js'] };
const stats = { colors: true };


const development = {
  devtool: '#eval-source-map',
  entry: [
    './src/index.js',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server'
  ],
  output: {
    filename: 'bundle.js',
    path: '/',
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Swello',
      template: 'index.ejs',
      inject: 'body' // Inject all scripts into the body
    }),
    definePlugin,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  module: {
    loaders,
    preLoaders: [
      { test: /\.js$/, loader: 'eslint', include: [path.resolve('src')] }
    ]
  },
  resolve,
  stats,
  devServer: {
    hot: true,
    historyApiFallback: {
      index: 'index.html',
      rewrites: [
        { from: /\/map/, to: '/index.html'},
        { from: /\/favorite/, to: '/index.html'},
        { from: /\/full/, to: '/index.html'},
        { from: /\/error/, to: '/index.html'},
      ]
    },
    stats: {
      // Do not show list of hundreds of files included in a bundle
      chunkModules: false,
      colors: true
    }
  }
};

const min = {
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    filename: `${require('./package.json').name}.min.js`,
    path: path.resolve('build'),
    publicPath: '/',
    library: 'Component',
    libraryTarget: 'umd'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Swello',
      template: 'index.ejs',
      inject: 'body' // Inject all scripts into the body
    }),
    definePlugin,
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  module: { loaders },
  resolve,
  stats
};


const test = {
  output: { libraryTarget: 'commonjs2' },
  module: { loaders }
};


const configs = { development, min, test };
const build = process.env.BUILD || process.env.NODE_ENV || 'development';


module.exports = configs[build];
