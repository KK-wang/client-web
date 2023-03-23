import axios, { AxiosError } from "axios";
import { message } from "antd";

const request = axios.create({
  baseURL: `http://${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}`, // 生产环境。
  timeout: 3000,
});

request.interceptors.request.use(config => {
  if (config.url !== "/token") 
    config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`; // 记着添加 Bearer 前缀。
  return config;
}, () => Promise.reject());

request.interceptors.response.use(res => res, (err: AxiosError) => {
  // 服务端响应非 2XX。
  message.error(`${err.response?.status}: ${err.response?.data}`);
  return Promise.reject();
});

export default request;
