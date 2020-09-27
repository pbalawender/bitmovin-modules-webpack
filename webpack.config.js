const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv').config({
    path: path.join(__dirname, '.env')
});
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = {
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": dotenv.parsed
        }),
        new HtmlWebpackPlugin({
            template: "public/index.html",
            filename: 'index.html'
        })
    ]
};

module.exports = config;
