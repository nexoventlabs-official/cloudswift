const isLocal = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const SERVER_ORIGIN =
  import.meta.env.VITE_SERVER_ORIGIN ||
  (isLocal ? 'http://localhost:5000' : (typeof window !== 'undefined' ? window.location.origin : ''));

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (isLocal ? 'http://localhost:5000/api' : '/api');

export const ADMIN_TOKEN_KEY = 'cloudswift_admin_token';

export function authHeaders() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}
