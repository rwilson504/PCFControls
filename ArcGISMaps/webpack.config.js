const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
var FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');

const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({    
    plugins:[                
        new FriendlyErrorsWebpackPlugin(),   
    ]
});