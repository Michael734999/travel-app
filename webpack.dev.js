const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin');
// const nodeExternals = require('webpack-node-externals')
// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")

module.exports = {
    entry: './src/client/index.js',
    output: {
        libraryTarget: 'var',
        library: 'Client'
    },
    mode: 'development',
    devServer: {
        proxy: {
            '/getGeoname': 'http://localhost:3000',
            '/getWeatherbit': 'http://localhost:3000',
            '/gitPixabay': 'http://localhost:3000',
            '/save': 'http://localhost:3000',
            '/getSave': 'http://localhost:3000',
            '/remove': 'http://localhost:3000',
            '/savePost': 'http://localhost:3000',
            '/getPost': 'http://localhost:3000',
        },
    },
    optimization: {
        minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    devtool: 'source-map',
    stats: 'verbose',
    module: {
        rules: [{
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jp?g|gif)$/i,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                    }
                }]
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/client/views/index.html',
            filename: './index.html'
        }),
        new CleanWebpackPlugin({
            dry: true,
            verbose: true,
            cleanStaleWebpackAssets: true,
            protectWebpackAssets: false
        }),
        new CopyPlugin({
            patterns: [
                { from: 'src/client/img', to: 'img' },
            ],
        }),
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        // new NodePolyfillPlugin()
    ]
}