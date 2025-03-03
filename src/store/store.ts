import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './rootSaga';
import authReducer from '../features/slices/auth-slice';
import organizationReducer from '../features/slices/organization-slice';
import userReducer from '../features/slices/auth-slice';
import pokemonReducer from '../features/slices/pokemon-slice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    organization: organizationReducer,
    auth: authReducer,
    user: userReducer,
    pokemon: pokemonReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: false,
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
