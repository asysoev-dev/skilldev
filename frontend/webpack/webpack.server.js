const { merge } = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
    mode: 'production',
    target: 'node',
    entry: './src/app/entry-server.ts',
    output: {
        path: path.resolve(__dirname, '../dist-server'),
        filename: 'entry-server.js',
        libraryTarget: 'commonjs2',
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    'css-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    externals: nodeExternals({
        allowlist: [/\.(css|scss|sass)$/, /\?vue&type=style/],
    }),
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
