import axios, { AxiosError } from "axios";
import { message } from "antd";

const request = axios.create({
  baseURL: `${process.env.BASE_URL}`,
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
