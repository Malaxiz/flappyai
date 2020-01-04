const path = require('path');

module.exports = {
    entry: './src/js/app.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: {
                    loader: "babel-loader",
                },
                exclude: [/node_modules/]
            }
        ]
    },
    resolve: {
        extensions: ['.ts'],
    },
    stats: {
        colors: true,
    },
    devtool: 'source-map',
    mode: 'development'
}