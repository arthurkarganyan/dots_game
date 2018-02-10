const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

const domainName = JSON.stringify((process.env.DOMAIN_NAME || "localhost"));

console.log("\ndomainName:" + domainName);

module.exports = merge(common, {
    module: {
        rules: [],
    },
    plugins: [
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            DOMAIN_NAME: domainName,
            // PRODUCTION: JSON.stringify(true),
            // VERSION: JSON.stringify("5fa3b9"),
            // BROWSER_SUPPORTS_HTML5: true,
            // TWO: "1+1",
            // "typeof window": JSON.stringify("object")
        })
        // new EnvironmentPlugin(['NODE_ENV'])
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        // }),
        // new ExtractTextPlugin("public/styles.css"),
    ]
});

