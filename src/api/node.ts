import request from "../utils/request";

export function getNodes () {
  return request({
    url: "/getNodes",
    method: "get",
  });
}

export function getAllNodesMetrics() {
  return request({
    url: "/getAllNodesMetrics",
    method: "get",
    timeout: Number.MAX_VALUE,
    // 这个接口会花费较长的时间返回。
  });
}