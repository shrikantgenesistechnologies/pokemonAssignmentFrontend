/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchData } from '../../utils/api';
import {
  fetchOrganizations,
  setOrganizationsFailed,
  setOrganizationsSuccess,
} from '../slices/organization-slice';
import { IOrganizations } from '../../store/rootState';

function* fetchAllOrganizations(): Generator {
  try {
    const response = yield call(fetchData, '/organizations');

    if (response) {
      yield put(setOrganizationsSuccess(response.data as IOrganizations[]));
    } else {
      yield put(setOrganizationsFailed(response.message[0] ?? response.message));
    }
  } catch (error: any) {
    yield put(setOrganizationsFailed(error.message));
  }
}

export function* watchOrganizations(): Generator {
  yield takeLatest(fetchOrganizations.type, fetchAllOrganizations);
}
