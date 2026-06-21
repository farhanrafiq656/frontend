import axios from 'axios';
import { getApiBaseUrl } from './apiBase';

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

export default api;
