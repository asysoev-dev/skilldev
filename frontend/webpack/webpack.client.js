const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
    mode: 'production',
    entry: './src/app/entry-client.ts',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'client.js',
        clean: true,
        publicPath: '/',
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.VUE_API_URL': JSON.stringify(
                process.env.VUE_API_URL || 'https://myskilldev.ru/api'
            ),
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ],
    optimization: {
        splitChunks: false,
    },
});
