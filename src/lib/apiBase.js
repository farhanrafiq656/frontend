const defaultApiHost = 'http://localhost:5000';

export function getApiBaseUrl() {
  const configuredUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || defaultApiHost;
  const normalizedUrl = configuredUrl.replace(/\/+$/, '');

  return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;
}

