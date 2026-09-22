function ModuloPendiente({ nombre }) {
  return (
    <div style={{ padding: '2rem', color: '#555' }}>
      <h2 style={{ margin: '0 0 0.5rem' }}>{nombre}</h2>
      <p>Este módulo se conectará más adelante cuando el backend (Spring Boot + MySQL) esté disponible.</p>
    </div>
  );
}

export default ModuloPendiente;
