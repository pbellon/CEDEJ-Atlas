// https://github.com/diegohaz/arc/wiki/Webpack
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WriteFilePlugin = require('write-file-webpack-plugin');
const devServer = require('@webpack-blocks/dev-server2');
const splitVendor = require('webpack-blocks-split-vendor');
const happypack = require('webpack-blocks-happypack');

const {
  addPlugins, createConfig, entryPoint, env, setOutput,
  sourceMaps, defineConstants, webpack,
} = require('@webpack-blocks/webpack2');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const sourceDir = process.env.SOURCE || 'src';
const dataDir = process.env.DATA || 'data';

const publicPath = `/${process.env.PUBLIC_PATH || ''}/`.replace('//', '/');
const dataPath = path.join(process.cwd(), dataDir);
const sourcePath = path.join(process.cwd(), sourceDir);
const outputPath = path.join(process.cwd(), 'dist');

const resolveModules = modules => () => ({
  resolve: {
    modules: [].concat(modules, ['node_modules']),
  },
});

const styles = () => () => ({
  module: {
    rules: [
    {
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    },
    ],
  },
});
const markdown = () => () => ({
  module: {
    rules: [{
      test: /\.md$/,
      exclude: [/node_modules/],
      loader: 'raw-loader'
    }]
  }
});
const babel = () => () => ({
  module: {
    rules: [
    { test: /\.jsx?$/, exclude: [/node_modules/, /\.swp$/, /\.swo$/], loader: 'babel-loader' },
    ],
  },
});

const commonsChunkPlugin = ()=>{
  return new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
    filename: '[name].[hash].js',
  });
};

const config = createConfig([
    entryPoint({
      app: ['./src/index.js'],
      vendor: [
        'babel-polyfill',
        'd3',
        'jspdf',
        'html2canvas',
        'leaflet',
        'leaflet-image',
        'lodash',
        'prop-types',
        'react',
        'react-dom',
        'react-leaflet',
        'react-markdown',
        'react-modal',
        'react-redux',
        'react-router-dom',
        'redux',
        'redux-form',
        'redux-form-submit',
        'redux-saga',
        'styled-components',
        'styled-tools',
        'styled-theme',
        'whatwg-fetch'
      ]
    }),
    setOutput({
      filename: '[name].[hash].js',
      chunkFilename:'[name].[hash].js',
      path: outputPath,
      publicPath,
    }),
    defineConstants({
      'process.env.NODE_ENV': process.env.NODE_ENV,
      'process.env.PUBLIC_PATH': publicPath.replace(/\/$/, ''),
    }),
    addPlugins([
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: path.join(process.cwd(), 'public/index.html'),
        }),
        new CopyWebpackPlugin([
          { from: dataPath, to: 'data' },
        ]),
    ]),
    happypack([
        markdown(),
        babel(),
        styles(),
    ], {
      cacheContext: { sourceDir },
    }),
    resolveModules(sourceDir),
    addPlugins([
        new webpack.ProgressPlugin(),
    ]),
    () => ({
      module: {
        rules: [
        { test: /\.(png|jpe?g|svg)$/, loader: 'url-loader?&limit=8000' },
        { test: /\.(woff2?|ttf|eot)$/, loader: 'url-loader?&limit=8000' },
        ],
      },
    }),

    env('development', [
        devServer({
          contentBase: 'public',
          stats: 'errors-only',
          historyApiFallback: { index: publicPath },
          hot: false,
          headers: { 'Access-Control-Allow-Origin': '*' },
          host,
          port,
        }),
        sourceMaps(),
        addPlugins([
          commonsChunkPlugin(),
          new BundleAnalyzerPlugin(),
          new WriteFilePlugin(),
          new webpack.NamedModulesPlugin(),
        ]),
    ]),

    env('production', [
        addPlugins([
          commonsChunkPlugin(),
          new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
        ]),
    ]),
    ]);

module.exports = config;
