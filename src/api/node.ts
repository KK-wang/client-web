import request from "../utils/request";

export function getNodes () {
  return request({
    url: "/getNodes",
    method: "get",
  });
}