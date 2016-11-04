'use strict';

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _ = require('lodash');

const isProduction = process.env.NODE_ENV === 'production';
const isDev = !isProduction;

module.exports = {
    target: 'web',
    entry: _.compact([
        !isProduction && 'webpack-hot-middleware/client',
        './src/main.js'
    ]),
    context: __dirname,
    devtool: 'eval',
    node: {
        __filename: true,
        __dirname: true
    },
    output: {
        publicPath: '/',
        path: path.resolve('./public'),
        filename: 'bundle.[name].js'
    },
    resolve: {
        modulesDirectories: [
            'node_modules',
            path.resolve(__dirname, './node_modules')
        ],
        extensions: ['', '.js', '.jsx', '.css', '.scss']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: _.compact([ isDev && 'react-hot', 'babel']),
                exclude: /node_modules/,
                presets: ['react']
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true
                }
            },
            {
                test: /(\.scss)$/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss!sass')
            },
            {
                test: /(\.css)$/,
                loader: ExtractTextPlugin.extract('style', 'css')
            }
        ]
    },
    postcss: [autoprefixer],
    plugins: _.compact([
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'index.html')
        }),
        isProduction && new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        }),
        isDev && new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('react.css', { allChunks: true }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': isProduction ? JSON.stringify('production') : JSON.stringify('dev')
            }
        })
    ])
};
