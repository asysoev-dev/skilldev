const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(baseConfig, {
    mode: 'production',
    entry: './src/app/entry-client.ts',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'client.js',
        clean: true,
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.VUE_API_URL': JSON.stringify(
                process.env.VUE_API_URL || 'https://myskilldev.ru/api'
            ),
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),
    ],
    optimization: {
        splitChunks: false,
    },
});
