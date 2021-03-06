const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const setupServer = require('../server/src/index')

module.exports = merge(common, {
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    contentBase: '/',
    disableHostCheck: true,
    quiet: false,
    compress: true,
    historyApiFallback: true,
    setup: setupServer,
  },
})
