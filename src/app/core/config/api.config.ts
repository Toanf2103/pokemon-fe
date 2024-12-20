// src/app/core/config/api.config.ts

import { environment } from '../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  endpoints: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    profile: '/auth/profile',
    // Thêm các endpoints khác ở đây
  },
};
