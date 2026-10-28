const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

export const API_BASE_URL = rawApiUrl.replace(/\/+$/, '');

/**
 * Standard fetch wrapper that ensures credentials (cookies) are sent with every request
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    credentials: 'include', // Always send HTTP-only authentication cookies
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let errorMessage = (data && data.message) || `Request failed with status ${response.status}`;
    if (data && Array.isArray(data.errors) && data.errors.length > 0) {
      errorMessage = data.errors.map((e) => e.message || e.msg || e).join(', ');
    }
    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const authApi = {
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  logout: () => request('/auth/logout', { method: 'POST' }),
};

export const profileApi = {
  getProfile: () => request('/profile', { method: 'GET' }),
  updateProfile: (profileData) => request('/profile', { method: 'PUT', body: profileData }),
  deleteProfile: () => request('/profile', { method: 'DELETE' }),
};

export default {
  auth: authApi,
  profile: profileApi,
};
