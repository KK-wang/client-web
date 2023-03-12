import request from "../utils/request";

export function token(username: string, password: string) {
  return request({
    url: "/login",
    method: "post",
    data: {
      username,
      password,
    }
  });
}