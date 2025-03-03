import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InitialRootState } from '../../store/initialState';
import { IOrganizations } from '../../store/rootState';

const organizationSlice = createSlice({
  name: 'organization',
  initialState: InitialRootState,
  reducers: {
    fetchOrganizations: (state) => {
      state.loading = true;
    },
    setOrganizationsSuccess: (state, action: PayloadAction<IOrganizations[]>) => {
      state.organizations = action.payload;
      state.loading = false;
    },
    setOrganizationsFailed: (state, action: PayloadAction<string>) => {
      state.error = true;
      state.loading = false;
      state.message = action.payload;
    },
  },
});

export const { fetchOrganizations, setOrganizationsSuccess, setOrganizationsFailed } =
  organizationSlice.actions;

export default organizationSlice.reducer;
