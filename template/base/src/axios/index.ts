/**
 * @                  江城子 . 程序员之歌
 * @
 * @              十年生死两茫茫，写程序，到天亮。
 * @                  千行代码，Bug何处藏。
 * @              纵使上线又怎样，朝令改，夕断肠。
 * @
 * @              领导每天新想法，天天改，日日忙。
 * @                  相顾无言，惟有泪千行。
 * @              每晚灯火阑珊处，夜难寐，加班狂。
 * @
 */

import type { AxiosResponse, ResponseType } from 'axios';
import { useLayoutStoreContext } from '@/store/layout';
import { service } from '@/axios/service';

const layout = useLayoutStoreContext();

type Options = {
  api: string
  params?: unknown;
  authType?: number;
  type?: number;
  base?: 'api-data-service' | 'api-data-management';
  contentType?: string;
  responseType?: 'blob';
  showLoading?: boolean;
  showMsg?: boolean;
}

type Result<T = null> = {
  message?: string;
  cause?: string;
  state: number;
  data?: T
} & T

declare type IConfig = {
  baseURL?: string;
  headers: {
    satoken?: string;
    'Content-Type'?: string;
  };
  responseType?: ResponseType;
  params?: unknown
}

/**
 *
 * @param options 接口请求入参
 * @param successFn 接口请求成功回调
 * @param errorFn 接口请求错误回调
 * @returns 接口请求返回数据
 */
export const fetchPost = async <T = null>(
  options: Options,
  successFn?: (data: Result<T>) => void,
  errorFn?: (data?: Result<T>) => void,
): Promise<Result<T>> => {
  const $message = window['$message'];
  const {
    api = '',
    params = {},
    base,
    responseType,
    showLoading,
    showMsg = true,
  } = options;
  const config: IConfig = { headers: { satoken: '' } };
  if (responseType) {
    config.responseType = responseType;
  }
  if (base) {
    config.baseURL = base;
  }
  if (params instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  if (showLoading) {
    layout.changeStatus(true);
  }
  const { status, data }: AxiosResponse<Result<T>> = await service.post(api, params, config).catch((e) => {
    return e.response;
  });
  if (showLoading) {
    layout.changeStatus(false);
  }
  if (successFn) {
    if (status === 200 && (responseType === 'blob' || data.state === 200)) {
      successFn(data);
      return Promise.resolve(data);
    } else {
      const { cause, message = `${api}接口数据异常` } = data || {};
      $message.error(cause || message || `${api}接口数据异常`);
      errorFn && errorFn(data);
    }
    return Promise.resolve(data);
  }
  if (status !== 200) {
    $message.error(`${api}接口异常`);
    return Promise.resolve(data);
  }
  if (responseType !== 'blob' && data.state !== 200 && showMsg) {
    const { message = `${api}接口数据异常`, cause } = data;
    $message.error(cause || message || `${api}接口数据异常`);
    return Promise.resolve(data);
  }
  return data;
};

/**
 *
 * @param options 接口请求入参
 * @param successFn 接口请求成功回调
 * @param errorFn 接口请求错误回调
 * @returns 接口请求返回数据
 */
export const fetchGet = async <T = null>(
  options: Options,
  successFn?: (data: Result<T>) => void,
  errorFn?: (data: Result<T>) => void,
): Promise<Result<T>> => {
  const $message = window['$message'];
  const {
    api = '',
    params = {},
    base,
    responseType,
    showLoading,
    showMsg = true,
  } = options;
  const config: IConfig = { headers: { satoken: '' }, params };
  if (base) {
    config.baseURL = base;
  }
  if (responseType) {
    config.responseType = responseType;
  }
  if (showLoading) {
    layout.changeStatus(true);
  }
  const response: AxiosResponse<Result<T>> = await service.get(api, config).catch((e) => {
    return e.response;
  });
  const { status, data } = response;
  if (showLoading) {
    layout.changeStatus(false);
  }
  if (successFn) {
    if (status === 200 && (responseType === 'blob' || data.state === 200)) {
      successFn(data);
      return Promise.resolve(data);
    } else {
      const { cause, message = `${api}接口数据异常` } = data || {};
      $message.error(cause || message || `${api}接口数据异常`);
      errorFn && errorFn(data);
    }
    return Promise.reject(data);
  }
  if (status !== 200) {
    $message.error(`${api}接口异常`);
    return Promise.reject(data);
  }
  if (responseType !== 'blob' && data.state !== 200 && showMsg) {
    const { cause, message = `${api}接口数据异常` } = data;
    $message.error(cause || message || `${api}接口数据异常`);
    return Promise.reject(data);
  }
  return data;
};
