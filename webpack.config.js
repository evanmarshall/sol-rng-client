const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: ['./src/index.js'],
    target: ['web'],
    // devtool: 'inline-source-map',
    mode: 'development',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '.deploy'),
    },
    resolve: {
        modules: ['src', 'node_modules', path.resolve(__dirname, '..', 'sol-rng', 'top', 'node_modules')],
        fullySpecified: false
    },
    plugins: [
        // fix "process is not defined" error:
        // (do "npm install process" before running the build)
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ]
};