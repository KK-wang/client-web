import request from "../utils/request";
import { PodType } from "../pages/pod/pod.slice";

export function clearPods() {
  return request({
    url: "/clearPods",
    method: "delete",
  });
}

export function createPods(data: PodType.PodCreateReqParam) {
  return request({
    url: "/createPods",
    method: "post",
    data,
  });
}

export function getAllPodsRunningInfo() {
  return request({
    url: "/getAllPodsRunningInfo",
    method: "get",
  })
}