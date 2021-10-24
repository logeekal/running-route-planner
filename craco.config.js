const {addBeforeLoader, loaderByName} = require( "@craco/craco" )

// craco.config.js
module.exports = {
  jest: {
    configure: {
      roots: ["<rootDir>/src"],
      testMatch: ["<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}"],
    },
  },

  //webpack: {
    //configure: (webpackConfig, { env, paths }) => {
      //const workerLoader = {
        //test: /\bmapbox-gl-csp-worker.js\b/i,
        //use: ["worker-loader"],
      //};

      //addBeforeLoader(webpackConfig, loaderByName("file-loader"), workerLoader);

      //return webpackConfig;
    //},
  //},
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
};
