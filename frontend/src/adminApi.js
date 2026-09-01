import { API_BASE_URL, authHeaders } from './config.js';

async function request(method, path, body, isFormData = false) {
  const headers = { ...authHeaders() };
  if (!isFormData && body) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json().catch(() => ({ success: false, message: 'Invalid response' }));
  if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
  return json;
}

export const api = {
  get:      (path)              => request('GET',    path),
  post:     (path, body)        => request('POST',   path, body),
  put:      (path, body)        => request('PUT',    path, body),
  patch:    (path, body)        => request('PATCH',  path, body),
  delete:   (path)              => request('DELETE', path),
  postForm: (path, formData)    => request('POST',   path, formData, true),
};
