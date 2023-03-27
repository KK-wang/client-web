const dotenv = require("dotenv");
const { DefinePlugin } = require("webpack");
dotenv.config();
const AutoUploadPlugin = require('./AutoUploadPlugin');

const dev = process.argv.includes("--dev");
const pluginAdd = [
  new DefinePlugin({
    "process.env.BASE_URL": dev ? JSON.stringify("/koa") : JSON.stringify(`http://${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}`),
  }),
]
if (!dev) {
  pluginAdd.push(new AutoUploadPlugin({
    remotePath: "./koa-server/static",
    host: "39.96.212.224",
    username: "root",
    password: "nydus,1234",
  }));
}

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
      add: pluginAdd,
    },
    configure: (config) => {
      const ignoreWarnings = [/Failed to parse source map/];
      return {...config, ignoreWarnings};
    },
  },
}