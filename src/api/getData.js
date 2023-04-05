import request from "@/utils/request";

/**
 * 获取用户数量
 */
export const getUserCount = () =>
  request({
    url: "/v1/users/count",
    method: "get",
  });

/**
 * 获取用户信息
 */
export const getUserList = (data) =>
  request({
    url: "/v1/users/list",
    method: "get",
    params: data,
  });
