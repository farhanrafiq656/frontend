const localApiHost = 'http://localhost:5000';
const productionApiHost = '/api';

export function getApiBaseUrl() {
  const fallbackUrl = import.meta.env.DEV ? localApiHost : productionApiHost;
  const configuredUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || fallbackUrl;
  const normalizedUrl = configuredUrl.replace(/\/+$/, '');

  return normalizedUrl.endsWith('/api') ? normalizedUrl : `${normalizedUrl}/api`;
}
