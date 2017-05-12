var path = require('path');

module.exports = {
    entry: "./src/index.ts",
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'bin'),
        publicPath: '/bin/',
        filename: "wally-fov-0.1.0.js",
        libraryTarget: "var",
        library: "WallyFov"
    },
    resolve: {
        extensions: ['.ts']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: [ 'ts-loader' ]
            }
        ]
    }
};
