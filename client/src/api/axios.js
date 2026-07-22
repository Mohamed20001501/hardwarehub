import axios from 'axios';

export const API_ORIGIN = 'https://honest-clarity-production-2076.up.railway.app';

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
  withCredentials: true,
});

export default api;
