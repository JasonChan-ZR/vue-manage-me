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

/**
 * 登录
 */
export const login = (data) =>
  request({
    url: "/admin/login",
    method: "post",
    data,
  });

/**
 * 获取定位城市
 */
export const cityGuess = () =>
  request({
    url: "/v1/cities",
    method: "get",
    params: { type: "guess" },
  });

/**
 * 获取餐馆数量
 */
export const getResturantsCount = () =>
  request({
    url: "/shopping/restaurants/count",
    method: "get",
  });

/**
 * 获取餐馆列表
 */
export const getResturants = (data) =>
  request({
    url: "/shopping/restaurants",
    method: "get",
    params: data,
  });

/**
 * 获取搜索地址
 */
export const searchplace = (data) => {
  data.type = "search";
  return request({ url: "v1/pois", method: "get", params: data });
};

/**
 * 种类列表
 */
export const foodCategory = () =>
  request({
    url: "/shopping/v2/restaurant/category",
    method: "get",
  });
