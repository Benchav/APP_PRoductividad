import axios from 'axios';


const API_BASE_URL = 'https://fasfttasko-c78vkonb0-benchavs-projects.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;