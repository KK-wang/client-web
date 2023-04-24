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
  if (err.response!.status === 400) message.error("密码错误");
  else if (err.response!.status === 401) message.error("用户名不存在");
  else if (err.response!.status === 403) message.error("无访问权限");
  else message.error("服务端响应有误，请查看控制台输出");
  return Promise.reject();
});

export default request;
