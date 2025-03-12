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
      yield put(registerSuccess(response.message));
      if (action.payload?.callback) {
        action.payload.callback('Register Success');
      }
    } else {
      yield put(registerFailed(response.message));
      if (action.payload?.callback) {
        action.payload.callback('Register Failed');
      }
    }
  } catch (error) {
    yield put(registerFailed((error as Error).message ?? 'Register Failed'));
    if (action.payload?.callback) {
      action.payload.callback('Register Failed');
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
      yield put(loginSuccess(response.message));
      if (action.payload?.callback) {
        action.payload.callback('Login Success');
      }
    } else {
      yield put(loginFailed(response.message));
      if (action.payload?.callback) {
        action.payload.callback('Login Failed');
      }
    }
  } catch (error) {
    yield put(loginFailed((error as Error).message ?? 'Login Failed'));
    if (action.payload?.callback) {
      action.payload.callback('Login Failed');
    }
  }
}

function* getUserDetails(action: PayloadAction<{ id: string; token?: string }>): Generator {
  try {
    const response = yield call(fetchData, `/users/${action.payload.id}`, {});

    if (response) {
      yield put(setUserDetails(response.data as IUser));
    } else {
      yield put(setUserDetailsFailed(response.message));
    }
  } catch (error) {
    yield put(setUserDetailsFailed((error as Error).message));
  }
}

function* logout(): Generator {
  try {
    const response = yield call(fetchData, '/auth/logout', {
      method: 'POST',
    });

    if (response) {
      yield put(clearToken(response.message));
    }
  } catch (error) {
    yield put(clearToken((error as Error).message));
  }
}

export function* watchRegistration(): Generator {
  yield takeLatest(registerRequest.type, registration);
  yield takeLatest(loginRequest.type, login);
  yield takeLatest(logoutRequest, logout);
  yield takeLatest(fetchUserDetails.type, getUserDetails);
}
