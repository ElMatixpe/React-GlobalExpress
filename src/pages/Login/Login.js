import { useState } from 'react';
import { validarFormatoContrasena, LONGITUD_MAX_CONTRASENA } from '../../utils/contrasena';
import { nombreUsuario, sinEspacios } from '../../utils/validaciones';
import { peticion } from '../../services/api';
import './Login.css';
import logo from '../../Imagenes/logo.jpg';
import { UserIconLogin, LockIcon, EyeIcon, EyeOffIcon } from '../../components/Icons/icons';

function Login({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!usuario.trim() || !contrasena.trim()) {
      setError('Por favor completa usuario y contraseña.');
      return;
    }

    const errorFormato = validarFormatoContrasena(contrasena);
    if (errorFormato) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    setCargando(true);
    try {
      // Backend: POST /api/usuarios/login -> { idUsuario, nombre, username, rol }
      const data = await peticion('/usuarios/login', {
        metodo: 'POST',
        cuerpo: { username: usuario.trim(), contrasena },
      });

      if (onLoginSuccess) onLoginSuccess(data);
    } catch (err) {
      setError(err.status === 401 ? 'Usuario o contraseña incorrectos.' : err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-panel-izquierdo">
        <div className="login-logo-circulo">
          <img src={logo} alt="Global Express" />
        </div>
        <h1 className="login-marca">GLOBAL EXPRESS</h1>
        <p className="login-subtitulo">Minimarket</p>
      </div>

      <div className="login-panel-derecho">
        <div className="login-form-wrapper">
          <div className="login-encabezado">
            <div className="login-logo-pequeno">
              <img src={logo} alt="Global Express" />
            </div>
            <h2>BIENVENIDO</h2>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <label className="login-label" htmlFor="usuario">
              <UserIconLogin /> Usuario
            </label>
            <input
              id="usuario"
              type="text"
              className="login-input"
              value={usuario}
              onChange={(e) => setUsuario(nombreUsuario(e.target.value))}
              autoComplete="username"
            />

            <label className="login-label" htmlFor="contrasena">
              <LockIcon /> Contraseña
            </label>
            <div className="login-input-contrasena-wrapper">
              <input
                id="contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                className="login-input login-input-contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(sinEspacios(e.target.value))}
                maxLength={LONGITUD_MAX_CONTRASENA}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-toggle-contrasena"
                onClick={() => setMostrarContrasena((prev) => !prev)}
                aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                tabIndex={-1}
              >
                {mostrarContrasena ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            <p className="login-ayuda">
              Entre 8 y 12 caracteres, con mayúscula, minúscula, número y símbolo especial.
            </p>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="login-boton" disabled={cargando}>
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
