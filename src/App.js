import { useEffect, useState } from 'react';
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import { peticion, guardarToken, registrarAlExpirarSesion } from './services/api';
import './App.css';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const handleLoginSuccess = (data) => {
    setUsuarioLogueado(data);
  };

  const handleCerrarSesion = () => {
    // Avisa al servidor para que invalide el token, se cierra la sesion
    peticion('/usuarios/logout', { metodo: 'POST' }).catch(() => {});
    guardarToken(null);
    setUsuarioLogueado(null);
  };

  // Si el servidor responde 401 (sesion vencida), se vuelve al login
  useEffect(() => {
    registrarAlExpirarSesion(() => {
      guardarToken(null);
      setUsuarioLogueado(null);
    });
  }, []);

  if (!usuarioLogueado) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Home
      usuario={usuarioLogueado}
      onCerrarSesion={handleCerrarSesion}
    />
  );
}

export default App;

