// src/app/core/config/api.config.ts

import { environment } from '../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    login: '/auth/login',
    register: '/auth/register',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    // Thêm các endpoints khác ở đây
    trailer: '/pokemons/trailer',
    pokemon: {
      home:'/pokemons',
      import:'/pokemons/import',
    },
    favorites:'/favorites/'
  },
};
