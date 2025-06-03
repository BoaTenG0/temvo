import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userToken: null,
  refreshToken: null,
  userInfo: null,
  firstTimeLogin: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfoAndToken(state, action) {
      state.userToken = action.payload.userToken;
      state.refreshToken = action.payload.refreshToken;
      state.userInfo = action.payload.userInfo;
      state.firstTimeLogin = action.payload.firstTimeLogin;
    },
    clearUserInfoAndToken(state) {
      state.userToken = null;
      state.refreshToken = null;
      state.userInfo = null;
      state.firstTimeLogin = false;
    },
    updateUserInfo(state, action) {
      state.userInfo = { ...state.userInfo, ...action.payload };
    }
  }
});

// Reducer
export default userSlice.reducer;
export const { setUserInfoAndToken, clearUserInfoAndToken, updateUserInfo } = userSlice.actions;
