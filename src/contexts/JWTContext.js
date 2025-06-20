/* eslint-disable no-unused-vars */

import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/reducers/actions';
import authReducer from 'store/reducers/auth';
import { setUserInfoAndToken, clearUserInfoAndToken } from 'store/reducers/user';
import { openSnackbar } from 'store/reducers/snackbar';

// project-imports
import Loader from 'components/Loader';
import axios from 'axios';

// Create a dedicated axios instance for auth
const authAxios = axios.create({
  baseURL: 'https://frogdev.wigal.com.gh/api/v1',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
  //   withCredentials: true
});

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  try {
    const decoded = jwtDecode(serviceToken);
    return decoded.exp > Date.now() / 1000;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
};

const setSession = (serviceToken) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    // Set default header for the auth axios instance
    authAxios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    delete authAxios.defaults.headers.common.Authorization;
  }
};

// Token refresh function
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // const response = await authAxios.post('/auth/refresh-token', {
    //   params: { refreshToken: refreshToken }
    // });
    const response = await authAxios.post(
      '/auth/refresh-token',
      {},
      {
        params: { refreshToken: refreshToken }
      }
    );

    const { data } = response.data;
    const { accessToken } = data;
    const newServiceToken = accessToken.token;

    // Update stored token
    setSession(newServiceToken);

    return newServiceToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const reduxDispatch = useDispatch();

  const handleLogout = useCallback(() => {
    setSession(null);
    dispatch({ type: LOGOUT });
    reduxDispatch(clearUserInfoAndToken());
  }, [dispatch, reduxDispatch]);

  // Setup axios interceptors
  useEffect(() => {
    // Request interceptor
    const requestInterceptor = authAxios.interceptors.request.use(
      (config) => {
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
        config.headers.Accept = 'application/json';
        const token = localStorage.getItem('serviceToken');
        if (token && verifyToken(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseInterceptor = authAxios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Don't try to refresh token for login, register, or reset-password requests
        const isAuthEndpoint =
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/reset-password');

        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          originalRequest._retry = true;

          try {
            const newToken = await refreshAccessToken();

            // Update Redux store with new token
            const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
            const refreshToken = localStorage.getItem('refreshToken');

            reduxDispatch(
              setUserInfoAndToken({
                userToken: newToken,
                refreshToken: refreshToken,
                userInfo: userInfo,
                firstTimeLogin: false
              })
            );

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return authAxios(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            handleLogout();
            return Promise.reject(refreshError);
          }
        }

        // Show error message for non-auth endpoints
        // Auth endpoints (login, register, reset-password) should handle their own errors
        if (!isAuthEndpoint) {
          const errMsg = error.response?.data?.message || error.message || 'Request failed';
          reduxDispatch(
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

    // Cleanup interceptors
    return () => {
      authAxios.interceptors.request.eject(requestInterceptor);
      authAxios.interceptors.response.eject(responseInterceptor);
    };
  }, [reduxDispatch, handleLogout]);

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = localStorage.getItem('serviceToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const storedUserInfo = localStorage.getItem('userInfo');

        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);

          // Parse stored user info
          let user = null;
          try {
            user = storedUserInfo ? JSON.parse(storedUserInfo) : null;
          } catch (parseError) {
            console.error('Failed to parse stored user info:', parseError);
            localStorage.removeItem('userInfo');
          }

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });

          // Update Redux store with stored data
          reduxDispatch(
            setUserInfoAndToken({
              userToken: serviceToken,
              refreshToken: refreshToken,
              userInfo: user,
              firstTimeLogin: false
            })
          );
        } else if (refreshToken) {
          // Try to refresh the token
          try {
            const newToken = await refreshAccessToken();
            const user = storedUserInfo ? JSON.parse(storedUserInfo) : null;

            dispatch({
              type: LOGIN,
              payload: {
                isLoggedIn: true,
                user
              }
            });

            reduxDispatch(
              setUserInfoAndToken({
                userToken: newToken,
                refreshToken: refreshToken,
                userInfo: user,
                firstTimeLogin: false
              })
            );
          } catch (refreshError) {
            // Refresh failed, clear everything
            handleLogout();
          }
        } else {
          // No valid tokens, logout
          handleLogout();
        }
      } catch (err) {
        console.error('Initialization error:', err);
        handleLogout();
      } finally {
        // Always set initialized to true
        dispatch({ type: 'SET_INITIALIZED' }); // You may need to add this action
      }
    };

    init();
  }, [reduxDispatch, handleLogout]);

  const login = async (email, password) => {
    try {


      // Extract data from the API response structure
      const { data } = response.data;
      const { accessToken, refreshToken, user, firstTimeLogin } = data;
      const serviceToken = accessToken.token;

      // Store tokens and user info
      setSession(serviceToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userInfo', JSON.stringify(user));

      // Update auth context
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user
        }
      });

      // Update Redux store
      reduxDispatch(
        setUserInfoAndToken({
          userToken: serviceToken,
          refreshToken: refreshToken,
          userInfo: user,
          firstTimeLogin: firstTimeLogin
        })
      );

      return { success: true, firstTimeLogin };
    } catch (error) {

      // Extract error message from various possible error structures
      let errorMessage = 'Login failed';

      if (error.response) {
        // Server responded with a status outside 2xx
        console.error('Login error response:', error.response.data);

        // Extract message from backend response
        const responseData = error.response.data;
        if (responseData) {
          errorMessage = responseData.message || responseData.error || 'Login failed';
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('Login error request:', error.request);
        errorMessage = 'No response from server';
      } else {
        // Something else happened while setting up the request
        console.error('Login setup error:', error.message);
        errorMessage = error.message || 'Login request failed';
      }

      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    handleLogout();
  };

  const resetPassword = async (email) => {
    try {
      const response = await authAxios.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <JWTContext.Provider
      value={{
        ...state,
        login,
        logout,
        resetPassword
      }}
    >
      {children}
    </JWTContext.Provider>
  );
};

JWTProvider.propTypes = {
  children: PropTypes.node
};

export default JWTContext;
