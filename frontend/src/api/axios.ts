import axios from 'axios';

// Création d'une instance Axios réutilisable pour pointer vers notre backend NestJS
const api = axios.create({
  baseURL: 'http://localhost:3000', // L'adresse de notre serveur NestJS
});

// Intercepteur pour injecter automatiquement le token JWT dans chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      // Configuration correcte de l'en-tête Authorization pour NestJS Passport
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
