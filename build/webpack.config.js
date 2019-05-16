const path = require('path');
module.exports = {
    entry: path.resolve(__dirname, "../src/index.ts"),
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "../dist")
    },

    watch: true,

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
        ]
    }
};