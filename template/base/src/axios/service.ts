import axios from 'axios';
import { refreshToken } from '@/axios/refreshToken';
import Cookies from 'js-cookie';

const baseURL = '/api-data-management/';

const instance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(config => {
  const token = Cookies.get('token');
  if (token && config.headers) {
    config.headers.token = token;
  }
  return config;
}, error => {
  console.log(error);
});

// 正在重试标记
let isRefreshing = false;
// 待重试组合
let queue: Array<() => void> = [];

instance.interceptors.response.use(async response => {
  const { state } = response.data;
  if (state == 401) {
    const config = response.config;
    if (!isRefreshing) {
      isRefreshing = true;
      refreshToken().then(() => {
        queue.forEach(cb => cb());
        queue = [];
      }).catch(res => {
        console.error('refreshtoken error =>', res);
      }).finally(() => {
        isRefreshing = false;
      });
    }
    return new Promise((resolve) => {
      queue.push(() => {
        resolve(instance(config));
      });
    });
  }
  return response;
}, error => {
  return Promise.reject(error);
});


export const service = instance;
