import axios from 'axios';

const normalizeBaseUrl = () => {
  const raw = (import.meta.env.VITE_API_BASE_URL || 'https://collegeguruji-backend.onrender.com/').trim();
  if (!raw) return '/api/v1';

  const withoutTrailingSlash = raw.replace(/\/+$/, '');
  return withoutTrailingSlash.endsWith('/api/v1')
    ? withoutTrailingSlash
    : `${withoutTrailingSlash}/api/v1`;
};

export const api = axios.create({
  baseURL: normalizeBaseUrl(),
});

export const setAuthToken = (token) => {
  if (!token) {
    delete api.defaults.headers.common.Authorization;
    return;
  }
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
};
