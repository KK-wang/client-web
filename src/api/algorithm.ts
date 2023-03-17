import request from "../utils/request";
import { AlgorithmReqParam } from "../pages/algorithm/algorithm.slice";

export function createAlgorithmTask(data: AlgorithmReqParam.IAlgorithmReqParam) {
  return request({
    url: "/createAlgorithmTask",
    method: "post",
    timeout: Number.MAX_VALUE, // 这个接口会花费较长的时间返回。
    data,
  });
}
