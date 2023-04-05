import axios from "axios";
import { Message } from "element-ui";
const service = axios.create({
  baseURL: "//elm.cangdu.org", // url = base url + request url
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    // 请求失败时执行
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 响应成功时执行
    let data = response.data;

    if (response.status !== 200) {
      Message({
        message: response.message || "Error",
        type: "error",
        duration: 5 * 1000,
      });
    } else {
      return data;
    }
  },
  (error) => {
    // 响应失败时执行
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
