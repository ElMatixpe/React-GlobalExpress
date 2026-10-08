import { useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Inicio from '../../components/Inicio/Inicio';
import Usuarios from '../../components/Usuarios/Usuarios';
import Ventas from '../../components/Ventas/Ventas';
import Reportes from '../../components/Reportes/Reportes';
import Productos from '../../components/Productos/Productos';
import Footer from '../../components/Footer/Footer';
import ModuloPendiente from '../../components/ModuloPendiente/ModuloPendiente';
import { UserPlusIcon, ChevronDownIcon } from '../../components/Icons/icons';
import PRODUCTOS_MOCK from '../../data/productosMock';
import VENTAS_MOCK from '../../data/ventasMock';
import './Home.css';

const TITULOS = {
  inicio: 'Inicio',
  ventas: 'Ventas',
  productos: 'Productos',
  usuarios: 'Usuarios',
  reportes: 'Reportes',
};

function Home({ usuario, onCerrarSesion, usuarios, setUsuarios }) {
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  // Estado compartido entre módulos (mock hasta conectar el backend)
  const [productos, setProductos] = useState(PRODUCTOS_MOCK);
  const [ventas, setVentas] = useState(VENTAS_MOCK);

  const renderContenido = () => {
    if (seccionActiva === 'inicio') return <Inicio usuario={usuario} />;
    if (seccionActiva === 'usuarios') return <Usuarios usuarios={usuarios} setUsuarios={setUsuarios} />;
    if (seccionActiva === 'productos')
      return <Productos productos={productos} setProductos={setProductos} />;
    if (seccionActiva === 'ventas')
      return (
        <Ventas usuario={usuario} ventas={ventas} setVentas={setVentas} productos={productos} />
      );
    if (seccionActiva === 'reportes') return <Reportes usuario={usuario} />;
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
