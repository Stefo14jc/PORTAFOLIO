// src/api/client.js
import axios from 'axios';

// Instancia configurada para la URL de JSON Server
const client = axios.create({
  baseURL: 'http://localhost:3001', // <-- VERIFICAR PUERTO
});

export default client;