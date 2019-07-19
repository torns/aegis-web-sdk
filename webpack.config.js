const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const Uglifyjs = require('uglifyjs-webpack-plugin');

const COMPILE = (process.env.NODE_ENV === 'compile');

let config = {
    // mode:"production",
    devtool: 'hidden-source-map',
    entry: {
        'Aegis': path.join(__dirname, './src/index')
    },
    output: {
        path: path.join(__dirname, 'lib'),
        filename: '[name].min.js',
        libraryTarget: 'umd',
        library: "Aegis",
    },
    resolve: {
        extensions: [".ts", ".js"],
        modules: [path.resolve(__dirname, "src"), "node_modules"]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015'],
                            // "plugins": [
                            //     ["transform-decorators-legacy"],
                            //     [
                            //         "transform-runtime", {
                            //             "polyfill": false,
                            //             "regenerator": true
                            //         }
                            //     ]
                            // ]
                        }
                    }
                ]
            },
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        // new Uglifyjs({
        //     uglifyOptions: {
        //         compress: {
        //             pure_funcs: ['console.log']
        //         },
        //         warnings: false
        //     }

        // }),
        new CleanWebpackPlugin(['dist'])]

}

module.exports = config;