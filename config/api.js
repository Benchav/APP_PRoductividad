// config/api.js
import axios from 'axios';

// Sustituye esta URL por la de tu despliegue en Railway
const API_BASE_URL = 'https://<tu-proyecto>.up.railway.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;