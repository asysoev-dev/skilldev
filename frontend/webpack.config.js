const Dotenv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = (env, argv) => {
    const isProduction = argv.mode === 'production';
    const isDevelopment = !isProduction;

    return {
        mode: isDevelopment ? 'development' : 'production',

        entry: './src/app/main.ts',
        // entry: './src/main.ts',

        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isProduction ? '[name].[contenthash].js' : '[name].js',
            clean: true,
            publicPath: '/',
        },

        resolve: {
            extensions: ['.ts', '.js', '.vue', '.json'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                '@app': path.resolve(__dirname, 'src/app'),
                '@pages': path.resolve(__dirname, 'src/pages'),
                '@features': path.resolve(__dirname, 'src/features'),
                '@widgets': path.resolve(__dirname, 'src/widgets'),
                '@entities': path.resolve(__dirname, 'src/entities'),
                '@shared': path.resolve(__dirname, 'src/shared'),
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
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },

        plugins: [
            new Dotenv({
                path: isDevelopment ? '../.env.dev' : '../.env.prod',
                systemvars: true,
            }),
            new VueLoaderPlugin(),
            new HtmlWebpackPlugin({
                template: './public/index.html',
                filename: 'index.html',
                title: 'SkillDev',
            }),
            new CopyWebpackPlugin({
                patterns: [{ from: 'public/favicon.ico', to: 'favicon.ico' }],
            }),
            new webpack.DefinePlugin({
                __VUE_OPTIONS_API__: JSON.stringify(true),
                __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
                __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
            }),
        ],

        devServer: {
            port: 3005,
            hot: true,
            open: true,
            historyApiFallback: true,
            client: {
                overlay: {
                    warnings: false,
                    errors: true,
                },
            },
        },

        performance: {
            hints: isDevelopment ? false : 'warning',
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
        },

        devtool: isProduction ? 'source-map' : 'eval-source-map',
    };
};
