/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialRootState } from '../../store/initialState';
import { ILogin, IRegister, IUser } from '../../store/rootState';
import { getCookie, removeCookie } from '../../utils/cookieHelper';

const authSlice = createSlice({
  name: 'auth',
  initialState: InitialRootState,
  reducers: {
    registerRequest: (
      state,
      _action: PayloadAction<{
        registerForm: IRegister;
        organizationId: string;
        callback: (message: string) => void;
      }>,
    ) => {
      state.error = false;
      state.loading = true;
    },
    registerSuccess: (state, action: PayloadAction<{ id: string; accessToken: string }>) => {
      state.user.token = action.payload.accessToken;
      state.user.id = action.payload.id;
      state.loading = false;
    },
    registerFailed: (state, action: PayloadAction<string>) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload;
    },
    resetRegister: (state) => {
      state.error = false;
      state.loading = false;
      state.message = '';
    },
    loginRequest: (
      state,
      _action: PayloadAction<{ loginForm: ILogin; callback: (message: string) => void }>,
    ) => {
      state.error = false;
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ id: string; accessToken: string }>) => {
      state.user.token = action.payload.accessToken;
      state.user.id = action.payload.id;
      state.loading = false;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload;
    },
    reset: (state) => {
      state.error = false;
      state.loading = false;
      state.message = '';
    },
    fetchUserDetails: (state, _action: PayloadAction<{ id: string; token: string }>) => {
      state.loading = true;
    },
    setUserDetails: (state, action: PayloadAction<IUser>) => {
      state.user.id = action.payload.id;
      state.user.name = action.payload.name;
      state.user.token = action.payload.token;
      state.user.email = action.payload.email;
    },
    setUserDetailsFailed: (state, action: PayloadAction<string>) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload;
      if (action.payload.includes('Unauthorized')) {
        state.user.token = '';
        state.user.id = '';
        state.message = 'Session expired. Please login again.';
        removeCookie('authToken');
        removeCookie('id');
      }
    },
    setToken: (state) => {
      state.user.token = getCookie('authToken') ?? '';
      state.user.id = getCookie('id') ?? '';
    },
    clearToken: (state) => {
      state.user.token = '';
      state.user.id = '';
      removeCookie('authToken');
      removeCookie('id');
    },
    logoutRequest: (state) => {
      state.loading = true;
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailed,
  reset,
  loginRequest,
  loginSuccess,
  loginFailed,
  fetchUserDetails,
  setUserDetails,
  setUserDetailsFailed,
  setToken,
  clearToken,
  logoutRequest,
} = authSlice.actions;

export default authSlice.reducer;
