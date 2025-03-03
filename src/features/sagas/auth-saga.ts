/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchData } from '../../utils/api';
import {
  clearToken,
  fetchUserDetails,
  loginFailed,
  loginRequest,
  loginSuccess,
  logoutRequest,
  registerFailed,
  registerRequest,
  registerSuccess,
  setUserDetails,
  setUserDetailsFailed,
} from '../slices/auth-slice';
import { ILogin, IRegister, IUser } from '../../store/rootState';
import { getCookie, setCookie } from '../../utils/cookieHelper';

function* registration(
  action: PayloadAction<{
    registerForm: IRegister;
    organizationId: string;
    callback: (message: string) => void;
  }>,
): Generator {
  try {
    const response = yield call(fetchData, '/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: action.payload?.registerForm.name,
        email: action.payload?.registerForm.email,
        password: action.payload?.registerForm.password,
        organizationId: action.payload?.organizationId,
      }),
    });

    if (response) {
      setCookie('authToken', response.data.accessToken, 7);
      setCookie('id', response.data.id, 7);

      yield put(registerSuccess(response.data));
      if (action.payload?.callback) {
        action.payload.callback('Register Success');
      }
    } else {
      yield put(registerFailed(response.message[0] ?? response.message));
      if (action.payload?.callback) {
        action.payload.callback('Register Failed');
      }
    }
  } catch (error: any) {
    yield put(registerFailed(error.message));
    if (action.payload?.callback) {
      action.payload.callback('Register Error');
    }
  }
}

function* login(
  action: PayloadAction<{ loginForm: ILogin; callback: (message: string) => void }>,
): Generator {
  try {
    const response = yield call(fetchData, '/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: action.payload?.loginForm?.email,
        password: action.payload?.loginForm?.password,
      }),
    });

    if (response) {
      setCookie('authToken', response.data.accessToken, 7);
      setCookie('id', response.data.id, 7);

      yield put(loginSuccess(response.data));
      if (action.payload?.callback) {
        action.payload.callback('Login Success');
      }
    } else {
      yield put(loginFailed(response.message[0] ?? response.message));
      if (action.payload?.callback) {
        action.payload.callback('Login Failed');
      }
    }
  } catch (error: any) {
    yield put(loginFailed(error.message));
    if (action.payload?.callback) {
      action.payload.callback('Login Error');
    }
  }
}

function* getUserDetails(action: PayloadAction<{ id: string; token: string }>): Generator {
  try {
    const response = yield call(fetchData, `/users/${action.payload.id}`, {
      token: action.payload.token,
    });

    if (response) {
      yield put(setUserDetails(response.data as IUser));
    } else {
      yield put(setUserDetailsFailed(response.message[0] ?? response.message));
    }
  } catch (error: any) {
    yield put(setUserDetailsFailed(error.message));
  }
}

function* logout(): Generator {
  try {
    const response = yield call(fetchData, '/auth/logout', {
      method: 'POST',
      token: getCookie('authToken') ?? '',
    });

    if (response) {
      yield put(clearToken());
    }
  } catch (error: any) {
    console.log('Error in Logout: ', error.message);
  }
}

export function* watchRegistration(): Generator {
  yield takeLatest(registerRequest.type, registration);
  yield takeLatest(loginRequest.type, login);
  yield takeLatest(logoutRequest, logout);
  yield takeLatest(fetchUserDetails.type, getUserDetails);
}
