import { fetchPost } from '@/axios';
import Cookies from 'js-cookie';

export const refreshToken = async () => {
  return await fetchPost({ api: 'login' }, ({ data }) => {
    const { accessToken } = data || {};
    Cookies.set('token', accessToken);
    return Promise.resolve(data);
  }, (error) => {
    console.log('>', error);
    return Promise.reject(error);
  });
};
