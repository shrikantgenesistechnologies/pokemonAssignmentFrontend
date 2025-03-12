import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialRootState } from '../../store/initialState';
import { deleteAllCookies } from '../../utils/cookieHelper';
import { Pokemon } from '../../store/rootState';

const pokemonSlice = createSlice({
  name: 'pokemonList',
  initialState: InitialRootState,
  reducers: {
    fetchPokemonLists: (state, action: PayloadAction<{ skip: number; take: number }>) => {
      state.loading = true;
      state.pokemon.skip = action.payload.skip;
      state.pokemon.take = action.payload.take;
    },
    setPokemonLists: (state, action) => {
      state.loading = false;
      state.pokemon.listofPokemon = action.payload.data;
      state.pokemon.metadata = action.payload.metadata;
    },
    setPokemonListsFailed: (state, action) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload.message;
      if (action.payload.includes('Unauthorized') || action.payload.includes('Token is invalid')) {
        state.message = 'Session expired. Please login again.';
        state.user.token = '';
        state.user.id = '';
        deleteAllCookies();
        state.pokemon = {
          listofPokemon: [],
          skip: 1,
          take: 15,
          metadata: {
            page: 0,
            totalPages: 0,
            pageSize: 0,
            totalRecords: 0,
          },
        };
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updatePokemonStatus: (state, _action: PayloadAction<{ id: string; status: string }>) => {
      state.loading = true;
    },
    updatePokemonListSuccess: (
      state,
      action: PayloadAction<{
        id: string;
        status: string;
      }>,
    ) => {
      state.loading = false;
      const { id, status } = action.payload;
      state.pokemon.listofPokemon = state.pokemon.listofPokemon.map((pokemon: Pokemon) => {
        if (pokemon.id !== id) return pokemon;

        let newType: 'like' | 'dislike' | 'neutral' = 'neutral';
        let likeCount = pokemon.totalLike;
        let dislikeCount = pokemon.totalDislike;

        if (status === pokemon.userFavoriteStatus) {
          newType = 'neutral';
          likeCount -= status === 'like' ? 1 : 0;
          dislikeCount -= status === 'dislike' ? 1 : 0;
        } else {
          newType = status as 'like' | 'dislike' | 'neutral';
          likeCount += status === 'like' ? 1 : pokemon.userFavoriteStatus === 'like' ? -1 : 0;
          dislikeCount +=
            status === 'dislike' ? 1 : pokemon.userFavoriteStatus === 'dislike' ? -1 : 0;
        }

        return {
          ...pokemon,
          userFavoriteStatus: newType,
          totalLike: likeCount,
          totalDislike: dislikeCount,
        };
      });
    },
    updatePokemonListFailed: (state, action) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload.message;
      if (action.payload.includes('Unauthorized') || action.payload.includes('Token is invalid')) {
        state.user.token = '';
        state.user.id = '';
        state.message = 'Session expired. Please login again.';
        deleteAllCookies();
      }
    },
  },
});

export const {
  fetchPokemonLists,
  setPokemonLists,
  setPokemonListsFailed,
  updatePokemonStatus,
  updatePokemonListFailed,
  updatePokemonListSuccess,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
