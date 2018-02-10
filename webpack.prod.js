const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

let a = merge(common, {
    module: {
        rules: [

        ],
    },
    plugins: [
        new UglifyJSPlugin(),
        // new ExtractTextPlugin("public/styles.css"),
    ]
});
console.log(a);
module.exports = a;

