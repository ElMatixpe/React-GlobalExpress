import { useEffect, useState } from 'react';
import USUARIOS_MOCK from '../../data/usuariosMock';
import Modal from '../Modales/Modal_Footer';
import './Usuarios.css';

function Usuarios() {
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [usuarioEliminar, setUsuarioEliminar] = useState(null);
  const [formEditar, setFormEditar] = useState({ nombre: '', usuario: '', rol: '' });

  const toggleMenu = (usuario) => {
    setMenuAbierto((actual) => (actual === usuario ? null : usuario));
  };

  const abrirEditar = (u) => {
    setFormEditar({ nombre: u.nombre, usuario: u.usuario, rol: u.rol });
    setUsuarioEditar(u);
    setMenuAbierto(null);
  };

  const abrirEliminar = (u) => {
    setUsuarioEliminar(u);
    setMenuAbierto(null);
  };

  const cerrarDialogs = () => {
    setUsuarioEditar(null);
    setUsuarioEliminar(null);
  };

  // Cerrar el menú con la tecla Escape
  useEffect(() => {
    const alPresionarTecla = (e) => {
      if (e.key === 'Escape') {
        setMenuAbierto(null);
        cerrarDialogs();
      }
    };
    document.addEventListener('keydown', alPresionarTecla);
    return () => document.removeEventListener('keydown', alPresionarTecla);
  }, []);

  // Solo visual (mock): no guarda cambios reales todavía
  const guardarEdicion = (e) => {
    e.preventDefault();
    setUsuarioEditar(null);
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
        <button className="users-button" type="button" disabled title="Próximamente">
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

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
              <th className="users-col-acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {USUARIOS_MOCK.map((u, index) => {
              const esUltimaFila = index === USUARIOS_MOCK.length - 1;
              return (
              <tr key={u.usuario}>
                <td>{u.nombre}</td>
                <td>{u.usuario}</td>
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
          </tbody>
        </table>
      </div>

      {/* <p className="users-note">
        Página inicial: el registro, edición y eliminación se habilitarán cuando se
        conecte el backend (Spring Boot + MySQL).
      </p> */}

      {usuarioEditar && (
        <Modal titulo="Editar usuario" onCerrar={() => setUsuarioEditar(null)}>
          <form className="users-form" onSubmit={guardarEdicion}>
            <label className="users-campo">
              <span>Nombre</span>
              <input
                type="text"
                value={formEditar.nombre}
                onChange={(e) => setFormEditar({ ...formEditar, nombre: e.target.value })}
                placeholder="Nombre completo"
              />
            </label>
            <label className="users-campo">
              <span>Usuario</span>
              <input
                type="text"
                value={formEditar.usuario}
                onChange={(e) => setFormEditar({ ...formEditar, usuario: e.target.value })}
                placeholder="Nombre de usuario"
              />
            </label>
            <label className="users-campo">
              <span>Rol</span>
              <select
                value={formEditar.rol}
                onChange={(e) => setFormEditar({ ...formEditar, rol: e.target.value })}
              >
                <option value="Administrador">Administrador</option>
                <option value="Cajero">Cajero</option>
              </select>
            </label>
            <p className="users-form-aviso">Vista previa: los cambios aún no se guardan (mock).</p>
            <div className="users-dialog-botones">
              <button
                className="users-btn-secundario"
                type="button"
                onClick={() => setUsuarioEditar(null)}
              >
                Cancelar
              </button>
              <button className="users-btn-primario" type="submit">
                Guardar
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
