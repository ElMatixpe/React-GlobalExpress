import USUARIOS_MOCK from '../../data/usuariosMock';
import './Usuarios.css';

function Usuarios() {
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

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Rol</th>
            </tr>
          </thead>
          <tbody>
            {USUARIOS_MOCK.map((u) => (
              <tr key={u.usuario}>
                <td>{u.nombre}</td>
                <td>{u.usuario}</td>
                <td>
                  <span className={`users-role users-role-${u.rol.toLowerCase()}`}>
                    {u.rol}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="users-note">
        Página inicial: el registro, edición y eliminación se habilitarán cuando se
        conecte el backend (Spring Boot + MySQL).
      </p>
    </div>
  );
}

export default Usuarios;
