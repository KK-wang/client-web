const dotenv = require("dotenv");
const { DefinePlugin } = require("webpack");
dotenv.config();
const CracoLessPlugin = require('craco-less');

module.exports = {
  devServer: {
    port: 3000,
    host: 'localhost',
    proxy: {
      "/koa": {
          target: 'http://localhost:8000',
          pathRewrite: { "^/koa": '' },
          secure: false,
          changeOrigin: true,
      },
    } 
  },
  webpack: {
    plugins: {
      add: [
        new DefinePlugin({
          "process.env.API_SERVER_HOST": JSON.stringify(process.env.API_SERVER_HOST),
          "process.env.API_SERVER_PORT": JSON.stringify(process.env.API_SERVER_PORT),
        })
      ],
    },
    configure: (config) => {
      const ignoreWarnings = [/Failed to parse source map/];
      return {...config, ignoreWarnings};
    },
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#03e9f4' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ]
}