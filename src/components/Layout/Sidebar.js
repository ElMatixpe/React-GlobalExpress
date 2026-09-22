import { HomeIcon, TagIcon, BoxIcon, UsersIcon, ReportIcon, LogoutIcon } from '../Icons/icons';
import './Sidebar.css';
import logo from '../../Imagenes/logo.jpg';

const MENU_ITEMS = [
  { key: 'inicio', label: 'Inicio', icon: HomeIcon },
  { key: 'ventas', label: 'Ventas', icon: TagIcon },
  { key: 'productos', label: 'Productos', icon: BoxIcon },
  { key: 'usuarios', label: 'Usuarios', icon: UsersIcon },
  { key: 'reportes', label: 'Reportes', icon: ReportIcon },
];

function Sidebar({ activo, onSeleccionar, onCerrarSesion }) {
  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-marca">
          <div className="sidebar-logo">
            <img src={logo} alt="Global Express" />
          </div>
          <div>
            <div className="sidebar-marca-titulo">GLOBAL EXPRESS</div>
            <div className="sidebar-marca-subtitulo">Minimarket</div>
          </div>
        </div>

        <nav className="sidebar-menu">
          {MENU_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`sidebar-item ${activo === key ? 'sidebar-item-activo' : ''}`}
              onClick={() => onSeleccionar(key)}
              type="button"
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <button className="sidebar-cerrar-sesion" onClick={onCerrarSesion} type="button">
        <LogoutIcon size={19} />
        <span>Cerrar Sesión</span>
      </button>
    </aside>
  );
}

export default Sidebar;
