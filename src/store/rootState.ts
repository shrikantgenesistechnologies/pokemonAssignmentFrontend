export interface IOrganizations {
  id: string;
  name: string;
}

export interface ILogin {
  loading?: boolean;
  error?: boolean;
  message?: string;
  severity?: string;
  email: string;
  password: string;
}

export interface IRegister {
  loading?: boolean;
  error?: boolean;
  message?: string;
  severity?: string;
  organizationId?: string;
  name: string;
  email: string;
  password: string;
}

export interface IUser {
  loading?: boolean;
  error?: boolean;
  message?: string;
  severity?: string;
  token: string;
  id: string;
  name: string;
  email: string;
}
export interface Pokemon {
  id: string;
  name: string;
  imageUrl: string;
  totalLike: number;
  totalDislike: number;
  userFavoriteStatus: string;
}
export interface IPokemon {
  loading?: boolean;
  error?: boolean;
  message?: string;
  severity?: string;
  listofPokemon: Pokemon[];
  skip?: number;
  take?: number;
  metadata: {
    page: number;
    totalPages: number;
    pageSize: number;
    totalRecords: number;
  };
}

export interface RootState {
  user: IUser;
  pokemon: IPokemon;
  organizations: IOrganizations[] | null;
  login: ILogin;
  register: IRegister;
}
