/**
 * API Client — centralized fetch wrapper for the FastAPI backend.
 * All requests go through the Vite proxy (/api → localhost:8000).
 */

const BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Get the stored JWT token.
 */
export function getToken() {
  return localStorage.getItem('blog_token');
}

/**
 * Store / remove the JWT token.
 */
export function setToken(token) {
  if (token) localStorage.setItem('blog_token', token);
  else localStorage.removeItem('blog_token');
}

/**
 * Core fetch wrapper with auth header injection and JSON handling.
 */
async function request(endpoint, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });

  // No content response
  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.detail || 'API request failed');
    error.status = res.status;
    throw error;
  }
  return data;
}

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------
export const auth = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/auth/me'),
};

// ---------------------------------------------------------------------------
// Post endpoints
// ---------------------------------------------------------------------------
export const posts = {
  list: (page = 1, perPage = 10) => request(`/posts/?page=${page}&per_page=${perPage}`),
  get: (slug) => request(`/posts/${slug}`),
  create: (payload) => request('/posts/', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  delete: (id) => request(`/posts/${id}`, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------------
// Comment endpoints
// ---------------------------------------------------------------------------
export const comments = {
  list: (postId) => request(`/posts/${postId}/comments/`),
  create: (postId, payload) => request(`/posts/${postId}/comments/`, { method: 'POST', body: JSON.stringify(payload) }),
  delete: (postId, commentId) => request(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }),
  vote: (postId, commentId, value) => request(`/posts/${postId}/comments/${commentId}/vote`, { method: 'POST', body: JSON.stringify({ value }) }),
};
