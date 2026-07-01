const { merge } = require('webpack-merge');
const path = require('path');
const Dotenv = require('dotenv-webpack');
const baseConfig = require('./webpack.base');

module.exports = merge(baseConfig, {
    mode: 'development',
    entry: './src/app/entry-client.ts',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        clean: true,
        publicPath: '/',
    },
    devtool: 'eval-source-map',
    devServer: {
        port: 3005,
        hot: true,
        open: false,
        historyApiFallback: true,
        client: {
            overlay: {
                warnings: false,
                errors: true,
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.(css|scss|sass)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
        ],
    },
    plugins: [
        new Dotenv({
            path: path.resolve(__dirname, '../../.env.dev'),
            systemvars: true,
        }),
    ],
    performance: {
        hints: false,
    },
});
