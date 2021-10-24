const {addBeforeLoader, loaderByName} = require( "@craco/craco" )

module.exports = {
  overrideWebpackConfig: (props)=> {

    const {webpackConfig, cracoConfig, pluginOptions, context: {env, paths}} = props

    const workerLoader = {
      test: pluginOptions.test,
      use: ['worker-loader']
    }

    addBeforeLoader(webpackConfig, loaderByName('file-loader'), workerLoader)

    return webpackConfig

  }
}
