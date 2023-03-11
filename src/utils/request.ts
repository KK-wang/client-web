import axios from "axios";

const request = axios.create({
  baseURL: `http://${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}`,
  timeout: 3000,
});

request.interceptors.request.use(config => {
  if (config.url !== "/token") 
    config.headers.Authorization = `Bearer  ${localStorage.getItem("token")}`; // 记着添加 Bearer 前缀。
  return config;
}, error => Promise.reject(error));

request.interceptors.response.use(res => {
  return res.data; // 数据过滤。
});

export default request;
