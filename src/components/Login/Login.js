import { useState } from 'react';
import USUARIOS_MOCK from '../../data/usuariosMock';
import './Login.css';
import logo from '../../Imagenes/logo.jpg';
import { UserIconLogin, LockIcon, EyeIcon, EyeOffIcon } from '../Icons/icons';

const LONGITUD_MIN_CONTRASENA = 8;
const LONGITUD_MAX_CONTRASENA = 12;

// Reglas de la contraseña: mínimo 8 posiciones, 1 mayúscula, 1 minúscula,
// 1 dígito y 1 símbolo especial.
// 1 dígito y 1 símbolo especial.
function validarFormatoContrasena(valor) {
  if (valor.length < LONGITUD_MIN_CONTRASENA) return `La contraseña debe tener al menos ${LONGITUD_MIN_CONTRASENA} caracteres.`;
  if (valor.length > LONGITUD_MAX_CONTRASENA) return `La contraseña no debe superar los ${LONGITUD_MAX_CONTRASENA} caracteres.`;
  if (!/[A-Z]/.test(valor)) return 'La contraseña debe incluir al menos una letra mayúscula.';
  if (!/[a-z]/.test(valor)) return 'La contraseña debe incluir al menos una letra minúscula.';
  if (!/\d/.test(valor)) return 'La contraseña debe incluir al menos un dígito.';
  if (!/[^A-Za-z0-9]/.test(valor)) return 'La contraseña debe incluir al menos un símbolo especial.';
  return '';
}

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
      // TODO: cuando tengas Spring Boot + MySQL, reemplaza el bloque mock de abajo por:
      // const res = await fetch('http://localhost:8080/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userName: usuario, contrasena }),
      // });
      // if (!res.ok) throw new Error('Credenciales inválidas');
      // const data = await res.json();

      await new Promise((resolve) => setTimeout(resolve, 400));

      const encontrado = USUARIOS_MOCK.find(
        (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.contrasena === contrasena
      );

      if (!encontrado) {
        setError('Usuario o contraseña incorrectos.');
        return;
      }

      const data = { nombre: encontrado.nombre, rol: encontrado.rol };
      if (onLoginSuccess) onLoginSuccess(data);
    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
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
              onChange={(e) => setUsuario(e.target.value)}
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
                onChange={(e) => setContrasena(e.target.value)}
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


//<img src={logo} alt="Global Express" />
//UserIconLogin