"use client";

const API = (process.env.NEXT_PUBLIC_API_BASE ?? "https://cloudswift.onrender.com/api").replace(/\/$/, "");
const TOKEN_KEY = "cs_admin_token";

export function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
export function logout() {
  clearToken();
  if (typeof window !== "undefined") window.location.href = "/admin/login";
}

function authHeaders(json = true): Record<string, string> {
  const h: Record<string, string> = {};
  if (json) h["Content-Type"] = "application/json";
  const t = getToken();
  if (t) h["Authorization"] = `Bearer ${t}`;
  return h;
}

async function handle(res: Response) {
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);
  return json;
}

export const adminApi = {
  base: API,
  get: (path: string) => fetch(`${API}${path}`, { headers: authHeaders(false) }).then(handle),
  post: (path: string, body?: unknown) =>
    fetch(`${API}${path}`, { method: "POST", headers: authHeaders(), body: body ? JSON.stringify(body) : undefined }).then(handle),
  put: (path: string, body?: unknown) =>
    fetch(`${API}${path}`, { method: "PUT", headers: authHeaders(), body: body ? JSON.stringify(body) : undefined }).then(handle),
  patch: (path: string, body?: unknown) =>
    fetch(`${API}${path}`, { method: "PATCH", headers: authHeaders(), body: body ? JSON.stringify(body) : undefined }).then(handle),
  del: (path: string) => fetch(`${API}${path}`, { method: "DELETE", headers: authHeaders(false) }).then(handle),
  postForm: (path: string, form: FormData) =>
    fetch(`${API}${path}`, { method: "POST", headers: authHeaders(false), body: form }).then(handle),
};
