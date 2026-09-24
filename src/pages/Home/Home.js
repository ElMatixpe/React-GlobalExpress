import { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Inicio from '../../components/Inicio/Inicio';
import Usuarios from '../../components/Usuarios/Usuarios';
import Footer from '../../components/Footer/Footer';
import ModuloPendiente from '../../components/ModuloPendiente/ModuloPendiente';
import { UserPlusIcon, ChevronDownIcon } from '../../components/Icons/icons';
import './Home.css';

const TITULOS = {
  inicio: 'Inicio',
  ventas: 'Ventas',
  productos: 'Productos',
  usuarios: 'Usuarios',
  reportes: 'Reportes',
};

function Home({ usuario, onCerrarSesion }) {
  const [seccionActiva, setSeccionActiva] = useState('inicio');

  const renderContenido = () => {
    if (seccionActiva === 'inicio') return <Inicio usuario={usuario} />;
    if (seccionActiva === 'usuarios') return <Usuarios />;
    return <ModuloPendiente nombre={TITULOS[seccionActiva]} />;
  };

  return (
    <div className="home-layout">
      <Sidebar
        activo={seccionActiva}
        onSeleccionar={setSeccionActiva}
        onCerrarSesion={onCerrarSesion}
      />

      <div className="home-contenido">
        <div className="home-topbar">
          <div className="home-usuario">
            <UserPlusIcon size={30} />
            <div className="home-usuario-texto">
              <span className="home-usuario-nombre">{usuario?.nombre}</span>
              <span className="home-usuario-rol">{usuario?.rol}</span>
            </div>
            <ChevronDownIcon />
          </div>
        </div>
        <hr className="home-separador" />

        <div className="home-main">{renderContenido()}</div>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
