import { useState } from 'react';
import Login from './pages/Login/Login';
import USUARIOS_MOCK from './data/usuariosMock';
import Home from './pages/Home/Home';
import './App.css';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  // Lista de usuarios compartida: Login la usa para validar y Usuarios para administrarla (mock)
  const [usuarios, setUsuarios] = useState(USUARIOS_MOCK);

  const handleLoginSuccess = (data) => {
    setUsuarioLogueado(data);
  };

  const handleCerrarSesion = () => {
    setUsuarioLogueado(null);
  };

  if (!usuarioLogueado) {
    return <Login onLoginSuccess={handleLoginSuccess} usuarios={usuarios} />;
  }

  return (
    <Home
      usuario={usuarioLogueado}
      onCerrarSesion={handleCerrarSesion}
      usuarios={usuarios}
      setUsuarios={setUsuarios}
    />
  );
}

export default App;


