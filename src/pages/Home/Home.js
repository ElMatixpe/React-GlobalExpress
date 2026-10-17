import { useCallback, useEffect, useState } from 'react';
import Sidebar from '../../components/Layout/Sidebar';
import Inicio from '../../components/Inicio/Inicio';
import Usuarios from '../../components/Usuarios/Usuarios';
import Ventas from '../../components/Ventas/Ventas';
import Reportes from '../../components/Reportes/Reportes';
import Productos from '../../components/Productos/Productos';
import Footer from '../../components/Footer/Footer';
import { UserPlusIcon, ChevronDownIcon } from '../../components/Icons/icons';
import { puedeVerSeccion, puedeGestionarProductos } from '../../utils/permisos';
import { listarProductos } from '../../services/productosApi';
import { listarVentas } from '../../services/ventasApi';
import './Home.css';

function Home({ usuario, onCerrarSesion }) {
  const [seccionActiva, setSeccionActiva] = useState('inicio');
  const [productos, setProductos] = useState([]); // viene del backend (MySQL)
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState('');
  const [ventas, setVentas] = useState([]); // viene del backend (MySQL)
  const [cargandoVentas, setCargandoVentas] = useState(true);
  const [errorVentas, setErrorVentas] = useState('');

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

  const cargarVentas = useCallback(async () => {
    setCargandoVentas(true);
    setErrorVentas('');
    try {
      setVentas(await listarVentas());
    } catch (err) {
      setErrorVentas(err.message);
    } finally {
      setCargandoVentas(false);
    }
  }, []);

  useEffect(() => {
    cargarVentas();
  }, [cargarVentas]);

  const renderContenido = () => {
    if (!puedeVerSeccion(usuario?.rol, seccionActiva)) {
      return (
        <div className="home-restringido">
          <h2>Acceso restringido</h2>
          <p>Tu rol ({usuario?.rol}) no tiene permiso para ver esta sección.</p>
        </div>
      );
    }
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
          puedeGestionar={puedeGestionarProductos(usuario?.rol)}
        />
      );
    if (seccionActiva === 'ventas')
      return (
        <Ventas
          usuario={usuario}
          ventas={ventas}
          setVentas={setVentas}
          productos={productos}
          cargando={cargandoVentas}
          errorCarga={errorVentas}
          onReintentar={cargarVentas}
        />
      );
    if (seccionActiva === 'reportes') return <Reportes usuario={usuario} />;
    return null;
  };

  return (
    <div className="home-layout">
      <Sidebar
        activo={seccionActiva}
        rol={usuario?.rol}
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
