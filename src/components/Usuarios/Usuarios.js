import { useEffect, useMemo, useState } from 'react';
import Modal from '../Modales/Modales';
import { SearchIcon, EyeIcon, EyeOffIcon } from '../Icons/icons';
import { validarFormatoContrasena, LONGITUD_MAX_CONTRASENA } from '../../utils/contrasena';
import {
  soloNombre,
  nombreUsuario,
  sinEspacios,
  soloEnteros,
} from '../../utils/validaciones';
import './Usuarios.css';

const FORM_VACIO = { nombre: '', usuario: '', contrasena: '', rol: 'Cajero' };

// El listado de usuarios vive en App para compartirlo con el Login.
function Usuarios({ usuarios, setUsuarios }) {
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  // Modal de crear / editar: 'crear' | 'editar' | null
  const [modo, setModo] = useState(null);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [error, setError] = useState('');

  const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.trim();
    if (!texto) return usuarios;
    return usuarios.filter((u) => String(u.id).includes(texto));
  }, [usuarios, busqueda]);

  const toggleMenu = (usuario) => {
    setMenuAbierto((actual) => (actual === usuario ? null : usuario));
  };

  const abrirCrear = () => {
    setForm(FORM_VACIO);
    setUsuarioEditar(null);
    setMostrarContrasena(false);
    setError('');
    setModo('crear');
  };

  const abrirEditar = (u) => {
    setForm({ nombre: u.nombre, usuario: u.usuario, contrasena: u.contrasena || '', rol: u.rol });
    setUsuarioEditar(u);
    setMostrarContrasena(false);
    setError('');
    setModo('editar');
    setMenuAbierto(null);
  };

  const abrirEliminar = (u) => {
    setUsuarioEliminar(u);
    setMenuAbierto(null);
  };

  const cerrarFormulario = () => {
    setModo(null);
    setUsuarioEditar(null);
    setError('');
  };

  // Cerrar el menú con la tecla Escape
  useEffect(() => {
    const alPresionarTecla = (e) => {
      if (e.key === 'Escape') {
        setMenuAbierto(null);
        setModo(null);
        setUsuarioEditar(null);
        setUsuarioEliminar(null);
      }
    };
    document.addEventListener('keydown', alPresionarTecla);
    return () => document.removeEventListener('keydown', alPresionarTecla);
  }, []);

  const actualizarCampo = (campo, valor) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setError('');
  };

  // Por ahora solo visual (mock): guarda en el estado local, no hay backend todavía.
  const guardarUsuario = (e) => {
    e.preventDefault();

    const nombre = form.nombre.trim();
    const usuario = form.usuario.trim();

    if (!nombre || !usuario) {
      setError('El nombre y el usuario son obligatorios.');
      return;
    }

    const duplicado = usuarios.some(
      (u) =>
        u.usuario.toLowerCase() === usuario.toLowerCase() &&
        (modo === 'crear' || u.id !== usuarioEditar.id)
    );
    if (duplicado) {
      setError('Ya existe un usuario con ese nombre de usuario.');
      return;
    }

    const errorContrasena = validarFormatoContrasena(form.contrasena);
    if (errorContrasena) {
      setError(errorContrasena);
      return;
    }

    if (modo === 'crear') {
      const siguienteId = usuarios.reduce((max, u) => Math.max(max, u.id), 0) + 1;
      setUsuarios((actual) => [
        ...actual,
        { id: siguienteId, nombre, usuario, contrasena: form.contrasena, rol: form.rol },
      ]);
    } else {
      setUsuarios((actual) =>
        actual.map((u) =>
          u.id === usuarioEditar.id
            ? { ...u, nombre, usuario, contrasena: form.contrasena, rol: form.rol }
            : u
        )
      );
    }

    cerrarFormulario();
  };

  // Solo visual (mock): no elimina realmente todavía
  const confirmarEliminacion = () => {
    setUsuarioEliminar(null);
  };

  return (
    <div className="users">
      <div className="users-header">
        <div>
          <h2 className="users-title">Usuarios</h2>
          <p className="users-subtitle">
            Lista de usuarios registrados en el sistema.
          </p>
        </div>
        <button className="users-button" type="button" onClick={abrirCrear}>
          + Nuevo usuario
        </button>
      </div>

      {menuAbierto && (
        <div
          className="users-menu-fondo"
          onClick={() => setMenuAbierto(null)}
          aria-hidden="true"
        />
      )}

      <div className="users-buscador">
        <SearchIcon size={16} color="#777" />
        <input
          type="text"
          inputMode="numeric"
          placeholder="Búsqueda por Id de Usuario"
          value={busqueda}
          onChange={(e) => setBusqueda(soloEnteros(e.target.value))}
        />
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Contraseña</th>
              <th>Rol</th>
              <th className="users-col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u, index) => {
              const esUltimaFila = index === usuariosFiltrados.length - 1;
              return (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre}</td>
                  <td>{u.usuario}</td>
                  <td aria-label="Contraseña oculta">{'*'.repeat(u.contrasena?.length || 8)}</td>
                  <td>
                    <span className={`users-role users-role-${u.rol.toLowerCase()}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="users-col-acciones">
                    <div className="users-acciones">
                      <button
                        className="users-puntos"
                        type="button"
                        aria-label={`Acciones de ${u.nombre}`}
                        aria-haspopup="menu"
                        aria-expanded={menuAbierto === u.usuario}
                        onClick={() => toggleMenu(u.usuario)}
                      >
                        ⋮
                      </button>
                      {menuAbierto === u.usuario && (
                        <div
                          className={`users-menu${esUltimaFila ? ' users-menu-arriba' : ''}`}
                          role="menu"
                        >
                          <button
                            className="users-menu-item"
                            type="button"
                            role="menuitem"
                            onClick={() => abrirEditar(u)}
                          >
                            Editar
                          </button>
                          <button
                            className="users-menu-item users-menu-item-peligro"
                            type="button"
                            role="menuitem"
                            onClick={() => abrirEliminar(u)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {usuariosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="users-vacio">
                  No se encontraron usuarios con ese ID.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modo && (
        <Modal
          titulo={modo === 'crear' ? 'Registrar nuevo usuario' : 'Editar usuario'}
          onCerrar={cerrarFormulario}
        >
          <form className="users-form" onSubmit={guardarUsuario} noValidate>
            <label className="users-campo">
              <span>Nombre</span>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => actualizarCampo('nombre', soloNombre(e.target.value))}
                placeholder="Nombre completo"
                autoComplete="off"
              />
            </label>
            <label className="users-campo">
              <span>Usuario</span>
              <input
                type="text"
                value={form.usuario}
                onChange={(e) => actualizarCampo('usuario', nombreUsuario(e.target.value))}
                placeholder="Nombre de usuario"
                autoComplete="off"
              />
            </label>
            <label className="users-campo">
              <span>Contraseña</span>
              <div className="users-contrasena-wrapper">
                <input
                  type={mostrarContrasena ? 'text' : 'password'}
                  value={form.contrasena}
                  onChange={(e) => actualizarCampo('contrasena', sinEspacios(e.target.value))}
                  placeholder="Contraseña"
                  maxLength={LONGITUD_MAX_CONTRASENA}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="users-toggle-contrasena"
                  onClick={() => setMostrarContrasena((v) => !v)}
                  aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  tabIndex={-1}
                >
                  {mostrarContrasena ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <small className="users-ayuda">
                Entre 8 y 12 caracteres, con mayúscula, minúscula, número y símbolo especial.
              </small>
            </label>
            <label className="users-campo">
              <span>Rol</span>
              <select value={form.rol} onChange={(e) => actualizarCampo('rol', e.target.value)}>
                <option value="Administrador">Administrador</option>
                <option value="Cajero">Cajero</option>
              </select>
            </label>

            {error && (
              <p className="users-error" role="alert">
                {error}
              </p>
            )}

            <div className="users-dialog-botones">
              <button className="users-btn-secundario" type="button" onClick={cerrarFormulario}>
                Cancelar
              </button>
              <button className="users-btn-primario" type="submit">
                {modo === 'crear' ? 'Registrar usuario' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {usuarioEliminar && (
        <Modal titulo="Eliminar usuario" onCerrar={() => setUsuarioEliminar(null)}>
          <p className="users-eliminar-texto">
            ¿Seguro que quieres eliminar a <strong>{usuarioEliminar.nombre}</strong>{' '}
            (@{usuarioEliminar.usuario})?
          </p>
          <p className="users-form-aviso">Esta acción es solo visual por ahora (mock).</p>
          <div className="users-dialog-botones">
            <button
              className="users-btn-secundario"
              type="button"
              onClick={() => setUsuarioEliminar(null)}
            >
              Cancelar
            </button>
            <button
              className="users-btn-peligro"
              type="button"
              onClick={confirmarEliminacion}
            >
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Usuarios;
