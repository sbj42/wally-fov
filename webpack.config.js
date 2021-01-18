/* eslint-disable @typescript-eslint/no-var-requires */
var path = require('path');
var config = require('./package.json');

module.exports = (env, argv) => {
    var filename = 'wally-fov-' + config.version;
    if (argv.mode === 'production') {
        filename += '.min.js';
    } else {
        filename += '.js';
    }
    return {
        entry: './src/index.ts',
        devtool: 'source-map',
        output: {
            path: path.resolve(__dirname, 'bin'),
            publicPath: '/bin/',
            filename: filename,
            libraryTarget: 'var',
            library: 'WallyFov'
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
};
