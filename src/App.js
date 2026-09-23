import { useState } from 'react';
import Login from './pages/Login/Login';
import Home from './components/Home/Home';
import './App.css';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);

  const handleLoginSuccess = (data) => {
    setUsuarioLogueado(data);
  };

  const handleCerrarSesion = () => {
    setUsuarioLogueado(null);
  };

  if (!usuarioLogueado) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return <Home usuario={usuarioLogueado} onCerrarSesion={handleCerrarSesion} />;
}

export default App;
