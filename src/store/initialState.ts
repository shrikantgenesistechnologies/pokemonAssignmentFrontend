import { IOrganizations, Pokemon } from './rootState';

export const InitialRootState = {
  loading: false,
  error: false,
  message: '',
  user: {
    token: '',
    id: '',
    name: '',
    email: '',
  },
  pokemon: {
    listofPokemon: [] as Pokemon[],
    skip: 1,
    take: 20,
    metadata: {
      page: 0,
      totalPages: 0,
      pageSize: 0,
      totalRecords: 0,
    },
  },
  organizations: [] as IOrganizations[],
  login: {
    email: '',
    passowrd: '',
  },
  register: {
    organizationId: '',
    name: '',
    email: '',
    password: '',
  },
};
