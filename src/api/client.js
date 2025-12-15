import axios from 'axios';

// Crea una instancia de Axios preconfigurada
const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // URL base de JSON Server
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;