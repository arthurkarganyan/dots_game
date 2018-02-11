const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

const domainName = JSON.stringify((process.env.DOMAIN_NAME || "localhost"));
console.log("\ndomainName:" + domainName);

module.exports = {
    entry: './client/app.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'public/dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            DOMAIN_NAME: domainName,
            // PRODUCTION: JSON.stringify(true),
            // VERSION: JSON.stringify("5fa3b9"),
            // BROWSER_SUPPORTS_HTML5: true,
            // TWO: "1+1",
            // "typeof window": JSON.stringify("object")
        }),
    ]
};