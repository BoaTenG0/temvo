import axios from 'axios';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import { clearUserInfoAndToken } from 'store/reducers/user';

const axiosInstance = axios.create({
  baseURL: 'https://frogdev.wigal.com.gh/api/v1',
  timeout: 50000, // 50 seconds timeout for requests
  headers: { 'Content-Type': 'application/json;charset=utf-8' }
});

// Token refresh function
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Create a separate axios instance for refresh to avoid interceptor loops
    const refreshAxios = axios.create({
      baseURL: 'https://frogdev.wigal.com.gh/api/v1',
      timeout: 50000 // 50 seconds timeout for refresh requests
    });

    const response = await refreshAxios.post('/auth/refresh', {
      refreshToken: refreshToken
    });

    const { data } = response.data;
    const { accessToken } = data;
    const newServiceToken = accessToken.token;

    // Update stored token
    localStorage.setItem('serviceToken', newServiceToken);

    return newServiceToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage instead of Redux to avoid hook issues
    const token = localStorage.getItem('serviceToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (res) => {
    if (!res.data) throw new Error('Request failed');
    // console.log('🚀 ~ res.data:', res.data);
    // console.log('🚀 ~ res.data.data:', res.data.data.data);

    // Handle different response structures
    if (Object.prototype.hasOwnProperty.call(res.data, 'data')) {
      // Check if it's a success response (status 200 with data or null data for delete operations)
      const { status, data, message } = res.data;
      const hasSuccess = Object.prototype.hasOwnProperty.call(res.data, 'status') && status === 200;

      if (hasSuccess) {
        return data; // Return data (can be null for delete operations)
      }

      // If not success but has data, return the full response
      if (res.data.success !== false) {
        return res.data;
      }

      throw new Error(message || 'Request failed');
    }

    throw new Error('Invalid response structure');
  },
  async (error) => {
    const originalRequest = error.config;
    const { response, message } = error || {};

    // Handle 401 errors with token refresh
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();

        // Update the authorization header for the retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear user data and redirect to login
        localStorage.removeItem('serviceToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');

        dispatch(clearUserInfoAndToken());

        // Show login required message
        dispatch(
          openSnackbar({
            open: true,
            message: 'Session expired. Please login again.',
            variant: 'alert',
            alert: {
              color: 'warning'
            },
            close: false
          })
        );

        return Promise.reject(refreshError);
      }
    }

    // Show error message for other errors
    const errMsg = response?.data?.message || message || 'Request failed';
    dispatch(
      openSnackbar({
        open: true,
        message: errMsg,
        variant: 'alert',
        alert: {
          color: 'error'
        },
        close: false
      })
    );

    return Promise.reject(error);
  }
);

class APIClient {
  get(config) {
    return this.request({ ...config, method: 'GET' });
  }

  post(config) {
    return this.request({ ...config, method: 'POST' });
  }

  put(config) {
    return this.request({ ...config, method: 'PUT' });
  }

  patch(config) {
    return this.request({ ...config, method: 'PATCH' });
  }

  delete(config) {
    return this.request({ ...config, method: 'DELETE' });
  }

  request(config) {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request(config)
        .then((res) => {
          resolve(res);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}

export default new APIClient();
