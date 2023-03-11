const dotenv = require("dotenv");
const { DefinePlugin } = require("webpack");

dotenv.config();

module.exports = {
  webpack: {
    plugins: {
      add: [
        new DefinePlugin({
          "process.env.API_SERVER_HOST": JSON.stringify(process.env.API_SERVER_HOST),
          "process.env.API_SERVER_PORT": JSON.stringify(process.env.API_SERVER_PORT),
        })
      ],
    }
  },
}