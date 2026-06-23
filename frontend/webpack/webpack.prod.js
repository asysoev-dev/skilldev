// на данный момент нигде не используется, оставлен для возможности запукать в SPA через npm run build:spa
const { merge } = require('webpack-merge');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
    mode: 'production',
    entry: './src/app/entry-client.ts',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash].js',
        clean: true,
        publicPath: '/',
    },
    devtool: 'source-map',
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '../../.env.dev'),
            systemvars: true,
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    performance: {
        hints: 'warning',
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
});
