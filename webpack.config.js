// https://github.com/diegohaz/arc/wiki/Webpack
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WriteFilePlugin = require('write-file-webpack-plugin');
const devServer = require('@webpack-blocks/dev-server2');
// const splitVendor = require('webpack-blocks-split-vendor');
const happypack = require('webpack-blocks-happypack');

const {
  addPlugins, createConfig, entryPoint, env, setOutput,
  sourceMaps, defineConstants, webpack,
} = require('@webpack-blocks/webpack2');

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;
const sourceDir = process.env.SOURCE || 'src';
const dataDir = process.env.DATA || 'data';
const localesDir = process.env.LOCALES || 'locales';

const publicPath = `/${process.env.PUBLIC_PATH || ''}/`.replace('//', '/');
const dataPath = path.join(process.cwd(), dataDir);
const localesPath = path.join(process.cwd(), localesDir);
// const sourcePath = path.join(process.cwd(), sourceDir);
const outputPath = path.join(process.cwd(), 'dist');

const resolveModules = modules => () => ({
  resolve: {
    modules: [].concat(modules, ['node_modules']),
  },
});

const styles = () => () => ({
  module: {
    rules: [{
      test: /\.css$/,
      loader: 'style-loader!css-loader',
    }],
  },
});

const markdown = () => () => ({
  module: {
    rules: [{
      test: /\.md$/,
      exclude: [/node_modules/],
      loader: 'raw-loader',
    }],
  },
});

const babel = () => () => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /\.swp$/, /\.swo$/],
        loader: 'babel-loader?presets[]=stage-1,presets[]=react,presets[]=es2016',
      },
    ],
  },
});

const commonsChunkPlugin = () => {
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
      '@turf/bbox',
      '@turf/bbox-polygon',
      '@turf/circle',
      '@turf/helpers',
      '@turf/inside',
      '@turf/centroid',
      '@turf/flatten',
      'babel-polyfill',
      'd3-path',
      'd3-scale',
      'file-saver',
      'geojson-vt',
      'i18next',
      'i18next-browser-languagedetector',
      'i18next-xhr-backend',
      'jspdf',
      'jszip',
      'html2canvas',
      'jsx-to-string',
      'leaflet',
      'leaflet-image',
      'lodash.merge',
      'lodash.upperfirst',
      'lodash.camelcase',
      'prop-types',
      'react',
      'react-dom',
      'react-icon-base',
      'react-i18next',
      'react-facebook',
      'react-leaflet',
      'react-markdown',
      'react-modal',
      'react-redux',
      'react-responsive',
      'react-router-dom',
      'react-tooltip',
      'redux',
      'redux-saga',
      'styled-components',
      'styled-tools',
      'styled-theme',
      'whatwg-fetch',
    ],
  }),
  setOutput({
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
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
    new HtmlWebpackPlugin({
      filename: '404.html',
      template: path.join(process.cwd(), 'public/404.html'),
    }),
    new HtmlWebpackPlugin({
      filename: '200.html',
      template: path.join(process.cwd(), 'public/index.html'),
    }),
    new HtmlWebpackPlugin({
      filename: 'en/index.html',
      template: path.join(process.cwd(), 'public/en/index.html'),
    }),
    new HtmlWebpackPlugin({
      filename: 'en/404.html',
      template: path.join(process.cwd(), 'public/en/404.html'),
    }),
    new HtmlWebpackPlugin({
      filename: 'en/200.html',
      template: path.join(process.cwd(), 'public/en/index.html'),
    }),
    // copie des fichiers de données qui nous intéresse.
    new CopyWebpackPlugin([
      {
        from: dataPath,
        to: 'data',
        ignore: [
          '*.(swo|swp|md)',
          'raw/*',
          'clean/*',
          'content/*',
          'topo-*.json',
        ],
      },
    ]),
    new CopyWebpackPlugin([
      {
        from: localesPath,
        to: 'locales',
        ignore: [
          '*.(swo|swp|md)',
        ],
      },
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
