import { all, fork } from 'redux-saga/effects';
import { watchRegistration } from '../features/sagas/auth-saga';
import { watchOrganizations } from '../features/sagas/organization-saga';
import { watchPokemonLists } from '../features/sagas/pokemon-saga';

export function* rootSaga() {
  yield all([fork(watchOrganizations), fork(watchRegistration), fork(watchPokemonLists)]);
}
