const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = smp.wrap({
    devtool: 'source-map',
    plugins: [
        // will clean the build folder on successful build
        new CleanWebpackPlugin(),
    ]
});