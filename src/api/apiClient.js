import axios from 'axios';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import { clearUserInfoAndToken } from 'store/reducers/user';

const axiosInstance = axios.create({
  baseURL: 'https://frogdev.wigal.com.gh/api/v1',
  timeout: 50000
  // ✅ Removed default Content-Type header to allow FormData uploads
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Token refresh function
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    console.log('🔄 Attempting token refresh...');

    // Create a separate axios instance for refresh to avoid interceptor loops
    const refreshAxios = axios.create({
      baseURL: 'https://frogdev.wigal.com.gh/api/v1',
      timeout: 50000,
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    });

    // const response = await refreshAxios.post('/auth/refresh-token', {
    //   params: { refreshToken: refreshToken }
    // });
    const response = await refreshAxios.post(
      '/auth/refresh-token',
      {},
      {
        params: { refreshToken: refreshToken }
      }
    );

    // console.log('✅ Token refresh response:', response.data);

    // Handle different response structures
    let newServiceToken;
    let newRefreshToken;
    if (response.data?.data?.accessToken?.token) {
      newServiceToken = response.data.data.accessToken.token;
      newRefreshToken = response.data.data.refreshToken;
    } else if (response.data?.accessToken?.token) {
      newServiceToken = response.data.accessToken.token;
      newRefreshToken = response.data.refreshToken;
    } else if (response.data?.token) {
      newServiceToken = response.data.token;
    } else {
      throw new Error('Invalid token refresh response structure');
    }

    // Update stored token
    localStorage.setItem('serviceToken', newServiceToken);
    localStorage.setItem('refreshToken', newRefreshToken);
    console.log('✅ New token stored successfully');

    return newServiceToken;
  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    console.error('❌ Error response:', error.response?.data);
    throw error;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Handle Content-Type based on data type
    if (config.data instanceof FormData) {
      // For FormData, completely remove Content-Type to let browser set it with boundary
      delete config.headers['Content-Type'];
      console.log('🗂️ FormData detected - removing Content-Type header');
    } else if (!config.headers['Content-Type']) {
      // Only set JSON content-type for non-FormData requests
      config.headers['Content-Type'] = 'application/json;charset=utf-8';
    }

    // Get token from localStorage instead of Redux to avoid hook issues
    const token = localStorage.getItem('serviceToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      //   console.log(
      //     '📤 Request with token:',
      //     config.method?.toUpperCase(),
      //     config.url,
      //     config.data instanceof FormData ? '(FormData)' : '(JSON)'
      //   );
    } else {
      console.log('⚠️ No token found for request:', config.method?.toUpperCase(), config.url);
    }

    // Debug: Log final headers
    // console.log('🔍 Final request headers:', config.headers);

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

      const error = new Error(message || 'Request failed');
      error.response = res;
      throw error;
    }

    return res.data;
  },
  async (error) => {
    const originalRequest = error.config;
    const { response } = error || {};

    console.log('❌ Request failed:', {
      status: response?.status,
      url: originalRequest?.url,
      method: originalRequest?.method,
      error: response?.data
    });

    // Handle 401 errors with token refresh
    if (response?.status === 401 && !originalRequest._retry) {
      console.log('🔐 401 Unauthorized - attempting token refresh');

      if (isRefreshing) {
        // If already refreshing, queue this request
        console.log('⏳ Token refresh in progress, queueing request...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        // Update the authorization header for the retry
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process queued requests
        processQueue(null, newToken);

        console.log('🔄 Retrying original request with new token');
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed, clearing user session');

        // Process queued requests with error
        processQueue(refreshError, null);

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
      } finally {
        isRefreshing = false;
      }
    }

    // Show error message for other errors
    const errMsg = response?.data?.message || error.message || 'Request failed';

    // Don't show snackbar for 401 errors (already handled above)
    if (response?.status !== 401) {
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
    }

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

  // Special method for file uploads
  postFormData(config) {
    const formDataConfig = {
      ...config,
      method: 'POST',
      headers: {
        ...config.headers
        // Explicitly remove Content-Type for FormData
      }
    };

    // Ensure Content-Type is not set for FormData
    if (formDataConfig.data instanceof FormData) {
      delete formDataConfig.headers['Content-Type'];
    }

    return this.request(formDataConfig);
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
