const dotenv = require("dotenv");
const { DefinePlugin } = require("webpack");
dotenv.config();
const AutoUploadPlugin = require('./AutoUploadPlugin');


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
        }),
        new AutoUploadPlugin({
          remotePath: "./koa-server/static",
          host: "39.96.212.224",
          username: "root",
          password: "nydus,1234",
        }),
      ],
    },
    configure: (config) => {
      const ignoreWarnings = [/Failed to parse source map/];
      return {...config, ignoreWarnings};
    },
  },
}