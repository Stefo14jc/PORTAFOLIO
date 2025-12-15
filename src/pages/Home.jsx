import React from 'react';
import useFetchData from '../hooks/useFetchData.js'; // <-- Con .js

const Home = () => {
  const { data: experiencia, loading, error } = useFetchData('/experiencia');

  if (loading) return <p>Cargando Hoja de Vida...</p>;
  if (error) return <p style={{color: 'red'}}>Error: {error}</p>;
  if (!experiencia || experiencia.length === 0) return <p>No hay datos de experiencia.</p>;

  return (
    <main className="content">
      <h1>👤 Hoja de Vida</h1>
      <section>
        <h2>Experiencia Profesional</h2>
        {experiencia.map((item) => (
          <div key={item.id} className="experiencia-item">
            <h3>{item.titulo} en {item.empresa}</h3>
            <p className="periodo">{item.periodo}</p>
            <p>{item.descripcion}</p>
          </div>
        ))}
      </section>
      {/* Agrega secciones para Estudios y Habilidades */}
    </main>
  );
};

export default Home;