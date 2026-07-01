const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
            '@app': path.resolve(__dirname, '../src/app'),
            '@pages': path.resolve(__dirname, '../src/pages'),
            '@features': path.resolve(__dirname, '../src/features'),
            '@widgets': path.resolve(__dirname, '../src/widgets'),
            '@entities': path.resolve(__dirname, '../src/entities'),
            '@shared': path.resolve(__dirname, '../src/shared'),
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    transpileOnly: true,
                },
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html'),
            filename: 'index.html',
            title: 'SkillDev',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../public/favicon.ico'), to: 'favicon.ico' },
            ],
        }),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: JSON.stringify(true),
            __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        }),
    ],
};
