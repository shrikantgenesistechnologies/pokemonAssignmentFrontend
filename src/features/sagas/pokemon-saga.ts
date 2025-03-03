/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchData } from '../../utils/api';
import {
  fetchPokemonLists,
  setPokemonLists,
  setPokemonListsFailed,
  updatePokemonStatus,
  updatePokemonListSuccess,
} from '../slices/pokemon-slice';
import { PayloadAction } from '@reduxjs/toolkit';
import { getCookie } from '../../utils/cookieHelper';

function* getPokemonLists(
  action: PayloadAction<{ token: string; skip: number; take: number }>,
): Generator {
  try {
    const response = yield call(
      fetchData,
      `/pokemons?skip=${action.payload.skip}&take=${action.payload.take}`,
      {
        token: getCookie('authToken') ?? action.payload.token ?? '',
      },
    );

    if (response) {
      yield put(setPokemonLists(response));
    } else {
      yield put(setPokemonListsFailed(response.message[0] ?? response.message));
    }
  } catch (error: any) {
    yield put(setPokemonListsFailed(error.message));
  }
}

function* updatePokemonLists(
  action: PayloadAction<{ token: string; id: string; status: string }>,
): Generator {
  try {
    const response = yield call(
      fetchData,
      `/pokemons/${action.payload.id}/favoriteStatus?favoriteStatus=${action.payload.status}`,
      {
        method: 'POST',
        token: getCookie('authToken') ?? action.payload.token ?? '',
      },
    );

    if (response) {
      const dataArray = {
        id: action.payload.id,
        status: action.payload.status,
      };
      yield put(updatePokemonListSuccess(dataArray));
    } else {
      yield put(setPokemonListsFailed(response.message[0] ?? response.message));
    }
  } catch (error: any) {
    yield put(setPokemonListsFailed(error.message));
  }
}

export function* watchPokemonLists(): Generator {
  yield takeLatest(fetchPokemonLists.type, getPokemonLists);
  yield takeLatest(updatePokemonStatus.type, updatePokemonLists);
}
