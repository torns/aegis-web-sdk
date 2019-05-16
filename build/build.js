const webpack = require('webpack');
const config = require('./webpack.config.js');

webpack(config, (e) => {
    if(e) throw e
    console.log("watching");
})