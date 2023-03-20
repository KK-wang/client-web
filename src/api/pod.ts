import request from "../utils/request";
import { PodType } from "../pages/pod/pod.slice";

export function clearPods() {
  return request<PodType.PodClearResponse>({
    url: "/clearPods",
    method: "delete",
  });
}

export function createPods(data: PodType.PodCreateReqParam) {
  return request<PodType.PodCreateResponse>({
    url: "/createPods",
    method: "post",
    data,
  });
}

export function getAllPodsRunningInfo() {
  return request<PodType.PodRunningInfo | PodType.PodUnfinished>({
    url: "/getAllPodsRunningInfo",
    method: "get",
  })
}