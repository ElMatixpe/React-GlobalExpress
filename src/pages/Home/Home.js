import { useCallback, useEffect, useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Inicio from '../../components/Inicio/Inicio';
import Usuarios from '../../components/Usuarios/Usuarios';
import Ventas from '../../components/Ventas/Ventas';
import Reportes from '../../components/Reportes/Reportes';
import Productos from '../../components/Productos/Productos';
import Footer from '../../components/Footer/Footer';
import { UserPlusIcon, ChevronDownIcon } from '../../components/Icons/icons';
import { listarProductos } from '../../services/productosApi';
import VENTAS_MOCK from '../../data/ventasMock';
import './Home.css';

function Home({ usuario, onCerrarSesion }) {
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  // Estado compartido entre módulos
  const [productos, setProductos] = useState([]); // viene del backend (MySQL)
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState('');
  const [ventas, setVentas] = useState(VENTAS_MOCK); // todavía mock

  const cargarProductos = useCallback(async () => {
    setCargandoProductos(true);
    setErrorProductos('');
    try {
      setProductos(await listarProductos());
    } catch (err) {
      setErrorProductos(err.message);
    } finally {
      setCargandoProductos(false);
    }
  }, []);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const renderContenido = () => {
    if (seccionActiva === 'inicio') return <Inicio usuario={usuario} />;
    if (seccionActiva === 'usuarios') return <Usuarios usuarioActual={usuario} />;
    if (seccionActiva === 'productos')
      return (
        <Productos
          productos={productos}
          setProductos={setProductos}
          cargando={cargandoProductos}
          errorCarga={errorProductos}
          onReintentar={cargarProductos}
        />
      );
    if (seccionActiva === 'ventas')
      return (
        <Ventas usuario={usuario} ventas={ventas} setVentas={setVentas} productos={productos} />
      );
    if (seccionActiva === 'reportes') return <Reportes usuario={usuario} />;
    return null;
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
