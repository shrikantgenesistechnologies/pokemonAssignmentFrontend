/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialRootState } from '../../store/initialState';
import { ILogin, IRegister, IUser } from '../../store/rootState';
import { deleteAllCookies, getCookie } from '../../utils/cookieHelper';

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
    registerSuccess: (state, action: PayloadAction<string>) => {
      state.user.token = getCookie('accessToken') ?? '';
      state.user.id = getCookie('id') ?? '';
      state.loading = false;
      state.message = action.payload;
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
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.user.token = getCookie('accessToken') ?? '';
      state.user.id = getCookie('id') ?? '';
      state.loading = false;
      state.message = action.payload;
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
    fetchUserDetails: (state, _action: PayloadAction<{ id: string; token?: string }>) => {
      state.loading = true;
    },
    setUserDetails: (state, action: PayloadAction<IUser>) => {
      state.user.token = getCookie('accessToken') ?? '';
      state.user.id = getCookie('id') ?? '';
      state.loading = false;
      state.user.name = action.payload.name;
      state.user.email = action.payload.email;
    },
    setUserDetailsFailed: (state, action: PayloadAction<string>) => {
      state.error = true;
      state.loading = false;
      state.user.id = '';
      state.user.token = '';
      state.message = action.payload;
      if (action.payload.includes('Unauthorized') || action.payload.includes('Token is invalid')) {
        state.message = 'Session expired. Please login again.';
        deleteAllCookies();
      }
    },
    setToken: (state) => {
      state.user.token = getCookie('accessToken') ?? '';
      state.user.id = getCookie('id') ?? '';
    },
    clearToken: (state, action: PayloadAction<string>) => {
      state.user.token = '';
      state.user.id = '';
      state.message = '';
      state.error = false;
      state.loading = false;
      if (action.payload.includes('Logout successful')) {
        deleteAllCookies();
      }
      if (action.payload.includes('Unauthorized') || action.payload.includes('Token is invalid')) {
        state.message = 'Session expired. Please login again.';
        deleteAllCookies();
      }
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
