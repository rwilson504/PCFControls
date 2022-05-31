const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = smp.wrap({
    devtool: 'source-map',
    module: {
        rules: [            
            {
              test: /\.css$/,
              use: [
                'style-loader',
                'css-loader'
              ]
            }
          ]
    },
    plugins:[
        new CleanWebpackPlugin()
     ]
  });