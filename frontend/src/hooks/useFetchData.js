import { useState, useEffect } from 'react';
import apiClient from '../api/client.js'; // <-- ¡IMPORTANTE! Con .js

/**
 * Custom Hook genérico para cargar datos de la API.
 * @param {string} endpoint - La ruta de la API (ej. '/posts', '/experiencia').
 */
const useFetchData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Uso de la instancia de Axios
        const response = await apiClient.get(endpoint); 
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar los datos. Asegúrese que el servidor JSON Server está corriendo.");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]); 

  return { data, loading, error };
};

export default useFetchData;