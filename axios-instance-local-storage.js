import axios from 'axios';
import { useLogin, useLogout } from '@/composables/useAuth';
import { globalRouter } from '@/helpers/globalRouter';

let timeoutId;

function resetTimeout() {
  // Clear the previous timeout, if any
  clearTimeout(timeoutId);
  // Set a new timeout to trigger the logout action after 20 minutes of inactivity
  timeoutId = setTimeout(() => {
    // Call the useLogout() function to log out the user
    useLogout();
    // Redirect the user to the login page
    globalRouter.router.push({ name: 'Login' });
  }, 30 * 60 * 1000); // 20 minutes in milliseconds
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_FRONTEND_URL,
});

const _addAuthorizationHeader = (request) => {
  request.headers && (request.headers.Accept = 'application/json');

  //Check login user and his information
  const authUser = useLogin();
  if (authUser.token) {
    request.headers && (request.headers.Authorization = `Bearer ${authUser.token}`);
  }
  // Call the resetTimeout() function to reset the timeout
  resetTimeout();

  // if (import.meta.env.DEV) {
  //   console.debug(`${request.method.toUpperCase()} ${request.baseURL + request.url}`);
  // }

  // Important: request interceptors **must** return the request.
  return request;
};

const _handleResponse = ({ data }) => {
  // Call the resetTimeout() function to reset the timeout
  resetTimeout();

  return data;
};

const _handleHttpError = (error) => {
  //handle response errors codes
  if (error?.response?.status === 401) {
    useLogout();
    globalRouter.router.push({ name: 'Login' });
  } else if (error?.response.status === 403) {
    globalRouter.router.push({ name: 'HttpForbidden' });
  } else if (error?.response.status === 404) {
    globalRouter.router.push({ name: 'NotFound' });
  }

  // Call the resetTimeout() function to reset the timeout
  resetTimeout();

  // Important: request interceptors **must** return the request.
  return Promise.reject(error?.response.data);
};

axiosInstance.interceptors.request.use(_addAuthorizationHeader, _handleHttpError);
axiosInstance.interceptors.response.use(_handleResponse, _handleHttpError);

export default axiosInstance;
