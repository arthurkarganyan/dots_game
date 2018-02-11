const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    module: {
        rules: [],
    },
    plugins: [
        new UglifyJSPlugin(),

        // new EnvironmentPlugin(['NODE_ENV'])
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        // }),
        // new ExtractTextPlugin("public/styles.css"),
    ]
});

