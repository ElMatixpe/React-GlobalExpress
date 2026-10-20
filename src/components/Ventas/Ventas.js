import { useMemo, useState } from 'react';
import Modal from '../Modales/Modales';
import Voucher from './Voucher';
import { SearchIcon } from '../Icons/icons';
import { soloNombre, soloEnteros, codigoProducto } from '../../utils/validaciones';
import { peticion } from '../../services/api';
import { desdeApiVenta, listarDetallesVenta } from '../../services/ventasApi';
import { puedeEliminarVentas } from '../../utils/permisos';
import './Ventas.css';

const METODOS_PAGO = ['Efectivo', 'Tarjeta', 'Yape', 'Plin'];

const FILTROS = [
  { key: 'exito', label: 'Con Éxito' },
  { key: 'todos', label: 'Mostrar Todo' },
  { key: 'cancelado', label: 'Cancelado' },
];

const moneda = (n) => `S/ ${Number(n).toFixed(2)}`;

function Ventas({ usuario, ventas, setVentas, productos, cargando, errorCarga, onReintentar }) {
  const [vista, setVista] = useState('historial'); 

  //Historial 
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('exito');

  const ventasFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return [...ventas]
      .sort((a, b) => b.codigo.localeCompare(a.codigo))
      .filter((v) => {
        if (filtro === 'exito' && v.estado !== 'Pagado') return false;
        if (filtro === 'cancelado' && v.estado !== 'Cancelado') return false;
        return !texto || v.codigo.toLowerCase().includes(texto);
      });
  }, [ventas, busqueda, filtro]);

  //Nueva venta
  const [cliente, setCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState('Tarjeta');
  const [carrito, setCarrito] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState('');
  const [ventaExitosa, setVentaExitosa] = useState(null);
  const [modalCancelar, setModalCancelar] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [voucherVenta, setVoucherVenta] = useState(null); // venta cuyo voucher se está viendo

  //Cancelar una venta ya registrada (eliminación lógica) 
  const [ventaPorCancelar, setVentaPorCancelar] = useState(null);
  const [errorCancelacion, setErrorCancelacion] = useState('');

  const abrirCancelacion = (venta) => {
    setErrorCancelacion('');
    setVentaPorCancelar(venta);
  };

  // PUT /api/ventas/{id}/cancelar: la venta no se borra, pasa de Pagado a Cancelado
  const cancelarRegistrada = async () => {
    setGuardando(true);
    setErrorCancelacion('');
    try {
      const respuesta = await peticion(`/ventas/${ventaPorCancelar.id}/cancelar`, { metodo: 'PUT' });
      const actualizada = desdeApiVenta(respuesta);
      setVentas((actual) => actual.map((v) => (v.id === actualizada.id ? actualizada : v)));
      setVentaDetalle((actual) => (actual && actual.id === actualizada.id ? actualizada : actual));
      setVentaPorCancelar(null);
      setBusqueda('');
      setFiltro('cancelado'); 
    } catch (err) {
      setErrorCancelacion(err.message);
    } finally {
      setGuardando(false);
    }
  };

  //Eliminar una venta cancelada de forma permanente (solo Administrador)
  const [ventaPorEliminar, setVentaPorEliminar] = useState(null);
  const [confirmacionTexto, setConfirmacionTexto] = useState('');
  const [errorEliminacion, setErrorEliminacion] = useState('');
  const puedeEliminar = puedeEliminarVentas(usuario?.rol);

  const abrirEliminacion = (venta) => {
    setErrorEliminacion('');
    setConfirmacionTexto('');
    setVentaPorEliminar(venta);
  };

  const cerrarEliminacion = () => {
    if (!guardando) setVentaPorEliminar(null);
  };

  // DELETE /api/ventas/{id}: borra la venta y su detalle de la base de datos. 
  const eliminarDefinitivo = async () => {
    setGuardando(true);
    setErrorEliminacion('');
    try {
      await peticion(`/ventas/${ventaPorEliminar.id}`, { metodo: 'DELETE' });
      const idEliminada = ventaPorEliminar.id;
      setVentas((actual) => actual.filter((v) => v.id !== idEliminada));
      setVentaDetalle((actual) => (actual && actual.id === idEliminada ? null : actual));
      setVoucherVenta((actual) => (actual && actual.id === idEliminada ? null : actual));
      setVentaPorEliminar(null);
    } catch (err) {
      setErrorEliminacion(err.message);
    } finally {
      setGuardando(false);
    }
  };

  //Detalle de una venta 
  const [ventaDetalle, setVentaDetalle] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState('');

  const verDetalle = async (venta) => {
    setVentaDetalle(venta);
    setDetalles([]);
    setErrorDetalle('');
    setCargandoDetalle(true);
    try {
      setDetalles(await listarDetallesVenta(venta.id));
    } catch (err) {
      setErrorDetalle(err.message);
    } finally {
      setCargandoDetalle(false);
    }
  };

  //Modal agregar producto
  const [modalProductos, setModalProductos] = useState(false);
  const [busquedaProd, setBusquedaProd] = useState('');
  const [cantidades, setCantidades] = useState({}); // { P001: 2 }

  const total = carrito.reduce((suma, i) => suma + i.precio * i.cantidad, 0);

  const productosModal = useMemo(() => {
    const texto = busquedaProd.trim().toLowerCase();
    if (!texto) return productos;
    return productos.filter((p) => p.codigo.toLowerCase().includes(texto));
  }, [productos, busquedaProd]);

  const limpiarNuevaVenta = () => {
    setCliente('');
    setMetodoPago('Tarjeta');
    setCarrito([]);
    setModoEdicion(false);
    setError('');
  };

  const abrirNuevaVenta = () => {
    setVista('nueva');
  };

  const abrirHistorial = () => {
    setVista('historial');
  };

  //Si ya hay productos en el carrito se pide confirmación; si no, simplemente se sale.
  const cancelarVenta = () => {
    if (carrito.length === 0) {
      limpiarNuevaVenta();
      setVista('historial');
      return;
    }
    setError('');
    setModalCancelar(true);
  };

  const seguirConVenta = () => setModalCancelar(false);

  // Envía la venta al backend (POST /api/ventas). El servidor toma los precios de la
  // base de datos, calcula el total y guarda la venta con su detalle.
  const enviarVenta = async (estado) => {
    const creada = await peticion('/ventas', {
      metodo: 'POST',
      cuerpo: {
        idUsuario: usuario?.idUsuario,
        cliente: cliente.trim(),
        metodoPago,
        estado,
        detalles: carrito.map((i) => ({ idProducto: i.id, cantidad: i.cantidad })),
      },
    });
    const venta = desdeApiVenta(creada);
    setVentas((actual) => [...actual, venta]);
    return venta;
  };

  const confirmarCancelacion = async () => {
    setGuardando(true);
    try {
      await enviarVenta('Cancelado');
      setModalCancelar(false);
      limpiarNuevaVenta();
      setBusqueda('');
      setFiltro('cancelado');
      setVista('historial');
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const abrirModalProductos = () => {
    setBusquedaProd('');
    setCantidades({});
    setModalProductos(true);
  };

  const cerrarModalProductos = () => setModalProductos(false);

  const cantidadElegida = (codigo) => cantidades[codigo] ?? 1;

  const agregarAlCarrito = (producto) => {
    const cantidad = Math.max(1, Math.floor(Number(cantidadElegida(producto.codigo))) || 1);
    setCarrito((actual) => {
      const existe = actual.find((i) => i.codigo === producto.codigo);
      if (existe) {
        return actual.map((i) =>
          i.codigo === producto.codigo ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [
        ...actual,
        {
          id: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          cantidad,
        },
      ];
    });
    setCantidades((actual) => ({ ...actual, [producto.codigo]: 1 }));
    setError('');
  };

  const quitarDelCarrito = (codigo) => {
    setCarrito((actual) => actual.filter((i) => i.codigo !== codigo));
  };

  const cambiarCantidad = (codigo, valor) => {
    const limpio = soloEnteros(String(valor), 3);
    const cantidad = limpio === '' ? '' : Number(limpio);
    setCarrito((actual) => actual.map((i) => (i.codigo === codigo ? { ...i, cantidad } : i)));
  };

  const normalizarCantidad = (codigo) => {
    setCarrito((actual) =>
      actual.map((i) => (i.codigo === codigo && !(i.cantidad >= 1) ? { ...i, cantidad: 1 } : i))
    );
  };

  const confirmarVenta = async () => {
    if (carrito.length === 0) {
      setError('Agrega al menos un producto al carrito para confirmar la venta.');
      return;
    }

    if (carrito.some((i) => !(i.cantidad >= 1))) {
      setError('Todas las cantidades deben ser números enteros mayores a 0.');
      return;
    }

    setGuardando(true);
    try {
      const venta = await enviarVenta('Pagado');
      setVentaExitosa(venta);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const cerrarExito = () => {
    setVentaExitosa(null);
    limpiarNuevaVenta();
    setBusqueda('');
    setFiltro('exito');
    setVista('historial');
  };

  const etiquetaFiltro = FILTROS.find((f) => f.key === filtro)?.label;

  return (
    <div className="ventas">
      <div className="ventas-toolbar">
        <button
          className={`ventas-btn-historial${vista === 'historial' ? ' ventas-btn-activo' : ''}`}
          type="button"
          onClick={abrirHistorial}
        >
          Historial de Ventas
        </button>
        <button
          className={`ventas-btn-nueva${vista === 'nueva' ? ' ventas-btn-activo' : ''}`}
          type="button"
          onClick={abrirNuevaVenta}
        >
          Nueva Venta
        </button>
      </div>

      {vista === 'historial' && (
        <>
          <div className="ventas-filtros-fila">
            <div className="ventas-buscador">
              <SearchIcon size={16} color="#777" />
              <input
                type="text"
                placeholder="Búsqueda por Id de Venta"
                value={busqueda}
                onChange={(e) => setBusqueda(codigoProducto(e.target.value, 5))}
              />
            </div>

            <div className="ventas-filtros">
              <span className="ventas-filtro-actual">Filtro: {etiquetaFiltro}</span>
              {FILTROS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  className={`ventas-pill ventas-pill-${f.key}${filtro === f.key ? ' ventas-pill-activa' : ''}`}
                  onClick={() => setFiltro(f.key)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {errorCarga && (
            <div className="ventas-banner-error" role="alert">
              <span>{errorCarga}</span>
              <button type="button" className="ventas-reintentar" onClick={onReintentar}>
                Reintentar
              </button>
            </div>
          )}

          <div className="ventas-table-container">
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>Codigo<small>venta</small></th>
                  <th>Fecha<small>venta</small></th>
                  <th>Cliente<small>venta</small></th>
                  <th>Vendedor<small>usuario</small></th>
                  <th>Metodo de Pago<small>venta</small></th>
                  <th>Total<small>venta</small></th>
                  <th>Estado<small>venta</small></th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.map((v) => (
                  <tr key={v.codigo}>
                    <td>{v.codigo}</td>
                    <td>{v.fecha}</td>
                    <td>{v.cliente}</td>
                    <td>{v.vendedor}</td>
                    <td>{v.metodoPago}</td>
                    <td>{moneda(v.total)}</td>
                    <td>
                      <span
                        className={`ventas-estado ${
                          v.estado === 'Pagado' ? 'ventas-estado-pagado' : 'ventas-estado-cancelado'
                        }`}
                      >
                        {v.estado}
                      </span>
                    </td>
                    <td className="ventas-acciones">
                      <div className="ventas-acciones-fila">
                        <button
                          type="button"
                          className="ventas-btn-detalle"
                          onClick={() => verDetalle(v)}
                        >
                          Ver detalle
                        </button>
                        <button
                          type="button"
                          className="ventas-btn-voucher"
                          onClick={() => setVoucherVenta(v)}
                        >
                          Voucher
                        </button>
                        {v.estado === 'Pagado' && (
                          <button
                            type="button"
                            className="ventas-btn-anular"
                            onClick={() => abrirCancelacion(v)}
                          >
                            Cancelar venta
                          </button>
                        )}
                        {v.estado === 'Cancelado' && puedeEliminar && (
                          <button
                            type="button"
                            className="ventas-btn-eliminar"
                            onClick={() => abrirEliminacion(v)}
                          >
                            Eliminar definitivamente
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {cargando && (
                  <tr>
                    <td colSpan={8} className="ventas-vacio">
                      Cargando ventas...
                    </td>
                  </tr>
                )}

                {!cargando && !errorCarga && ventasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={8} className="ventas-vacio">
                      No se encontraron ventas con esos criterios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {ventaDetalle && (
            <section className="ventas-detalle">
              <div className="ventas-detalle-header">
                <h3>Detalle de la venta {ventaDetalle.codigo}</h3>
                <button
                  type="button"
                  className="ventas-btn-cancelar"
                  onClick={() => setVentaDetalle(null)}
                >
                  Cerrar detalle
                </button>
              </div>

              {errorDetalle && (
                <p className="ventas-error" role="alert">
                  {errorDetalle}
                </p>
              )}

              <div className="ventas-table-container">
                <table className="ventas-table">
                  <thead>
                    <tr>
                      <th>Código<small>producto</small></th>
                      <th>Producto<small>producto</small></th>
                      <th>Marca<small>producto</small></th>
                      <th>Cantidad<small>detalle_venta</small></th>
                      <th>Precio unit.<small>detalle_venta</small></th>
                      <th>Subtotal<small>detalle_venta</small></th>
                    </tr>
                  </thead>
                  <tbody>
                    {detalles.map((d) => (
                      <tr key={d.id}>
                        <td>{d.codigo}</td>
                        <td>{d.nombre}</td>
                        <td>{d.marca}</td>
                        <td>{d.cantidad}</td>
                        <td>{moneda(d.precioUnitario)}</td>
                        <td>{moneda(d.subtotal)}</td>
                      </tr>
                    ))}

                    {cargandoDetalle && (
                      <tr>
                        <td colSpan={6} className="ventas-vacio">
                          Cargando detalle...
                        </td>
                      </tr>
                    )}

                    {!cargandoDetalle && !errorDetalle && detalles.length === 0 && (
                      <tr>
                        <td colSpan={6} className="ventas-vacio">
                          Esta venta no tiene productos registrados.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="ventas-detalle-total">
                <span>Total de la venta:</span>
                <strong>{moneda(ventaDetalle.total)}</strong>
              </div>
            </section>
          )}
        </>
      )}

      {vista === 'nueva' && (
        <div className="ventas-nueva">
          <h2 className="ventas-titulo">Registrar nueva venta</h2>

          <div className="ventas-form-fila">
            <label className="ventas-campo">
              <span>Cliente</span>
              <input
                type="text"
                placeholder="Ingrese Nombre:"
                value={cliente}
                onChange={(e) => setCliente(soloNombre(e.target.value))}
              />
            </label>

            <label className="ventas-campo">
              <span>Método de pago</span>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                {METODOS_PAGO.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="ventas-carrito-contenedor">
            <table className="ventas-carrito">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th className="ventas-col-quitar"></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((i) => (
                  <tr key={i.codigo}>
                    <td>{i.nombre}</td>
                    <td>
                      {modoEdicion ? (
                        <input
                          className="ventas-input-cantidad"
                          type="text"
                          inputMode="numeric"
                          value={i.cantidad}
                          onChange={(e) => cambiarCantidad(i.codigo, e.target.value)}
                          onBlur={() => normalizarCantidad(i.codigo)}
                          aria-label={`Cantidad de ${i.nombre}`}
                        />
                      ) : (
                        i.cantidad
                      )}
                    </td>
                    <td>{moneda(i.precio)}</td>
                    <td>{moneda(i.precio * i.cantidad)}</td>
                    <td className="ventas-col-quitar">
                      <button
                        className="ventas-btn-quitar"
                        type="button"
                        onClick={() => quitarDelCarrito(i.codigo)}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}

                {carrito.length === 0 && (
                  <tr>
                    <td colSpan={5} className="ventas-vacio">
                      El carrito está vacío. Usa “+ Agregar Producto” para añadir productos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="ventas-acciones-fila">
            <div className="ventas-acciones-izq">
              <button className="ventas-btn-agregar" type="button" onClick={abrirModalProductos}>
                + Agregar Producto
              </button>
              <button
                className="ventas-btn-editar"
                type="button"
                onClick={() => setModoEdicion((v) => !v)}
                disabled={carrito.length === 0}
              >
                {modoEdicion ? 'Terminar edición' : 'Editar Producto'}
              </button>
            </div>

            <div className="ventas-total">
              <span>Total:</span>
              <strong>{moneda(total)}</strong>
            </div>
          </div>

          {error && (
            <p className="ventas-error" role="alert">
              {error}
            </p>
          )}

          <div className="ventas-botones-finales">
            <button className="ventas-btn-cancelar" type="button" onClick={cancelarVenta}>
              Cancelar
            </button>
            <button className="ventas-btn-confirmar" type="button" onClick={confirmarVenta}
              disabled={guardando}
            >
              {guardando ? 'Registrando...' : 'Confirmar Venta'}
            </button>
          </div>
        </div>
      )}

      {modalProductos && (
        <Modal titulo="Agregar producto" onCerrar={cerrarModalProductos} ancho={640}>
          <div className="ventas-modal-busqueda">
            <div className="ventas-buscador ventas-buscador-modal">
              <SearchIcon size={16} color="#777" />
              <input
                type="text"
                placeholder="Buscar por Id de producto (ej. P001)"
                value={busquedaProd}
                onChange={(e) => setBusquedaProd(codigoProducto(e.target.value))}
                autoFocus
              />
              {busquedaProd && (
                <button
                  type="button"
                  className="ventas-buscador-limpiar"
                  onClick={() => setBusquedaProd('')}
                  aria-label="Limpiar búsqueda"
                >
                  ×
                </button>
              )}
            </div>
            <span className="ventas-modal-contador">
              {productosModal.length} {productosModal.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          <div className="ventas-modal-lista">
            {productosModal.map((p) => {
              const disponible = p.estado === 'Disponible';
              const enCarrito = carrito.find((i) => i.codigo === p.codigo);
              return (
                <div
                  key={p.codigo}
                  className={`ventas-modal-item${disponible ? '' : ' ventas-modal-item-off'}`}
                >
                  <div className="ventas-modal-info">
                    <span className="ventas-modal-codigo">{p.codigo}</span>
                    <span className="ventas-modal-nombre">{p.nombre}</span>
                    <span className="ventas-modal-detalle">
                      {p.marca} · {moneda(p.precio)}
                      {!disponible && <em> · No disponible</em>}
                      {enCarrito && <em className="ventas-modal-encarrito"> · En carrito: {enCarrito.cantidad}</em>}
                    </span>
                  </div>
                  <input
                    className="ventas-input-cantidad"
                    type="text"
                    inputMode="numeric"
                    value={cantidadElegida(p.codigo)}
                    onChange={(e) =>
                      setCantidades((a) => ({ ...a, [p.codigo]: soloEnteros(e.target.value, 3) }))
                    }
                    disabled={!disponible}
                    aria-label={`Cantidad de ${p.nombre}`}
                  />
                  <button
                    className="ventas-btn-agregar ventas-btn-agregar-chico"
                    type="button"
                    disabled={!disponible}
                    onClick={() => agregarAlCarrito(p)}
                  >
                    Agregar
                  </button>
                </div>
              );
            })}

            {productosModal.length === 0 && (
              <p className="ventas-vacio">No se encontraron productos con ese código.</p>
            )}
          </div>

          <div className="ventas-modal-pie">
            <button className="ventas-btn-confirmar" type="button" onClick={cerrarModalProductos}>
              Listo
            </button>
          </div>
        </Modal>
      )}

      {modalCancelar && (
        <Modal titulo="Cancelar venta" onCerrar={seguirConVenta}>
          <p className="ventas-cancelar-texto">
            ¿Estás seguro de que deseas cancelar esta venta? Se registrará en el historial como{' '}
            <strong>Cancelado</strong>.
          </p>
          {error && (
            <p className="ventas-error" role="alert">
              {error}
            </p>
          )}
          <div className="ventas-botones-finales">
            <button className="ventas-btn-cancelar" type="button" onClick={seguirConVenta}>
              Seguir con la venta
            </button>
            <button className="ventas-btn-peligro" type="button" onClick={confirmarCancelacion}
              disabled={guardando}
            >
              {guardando ? 'Registrando...' : 'Sí, cancelar venta'}
            </button>
          </div>
        </Modal>
      )}

      {ventaExitosa && (
        <Modal titulo="Venta registrada" onCerrar={cerrarExito}>
          <div className="ventas-exito">
            <div className="ventas-exito-icono" aria-hidden="true">
              ✓
            </div>
            <h3>¡Venta realizada con éxito!</h3>
            <p>
              Venta <strong>N° {ventaExitosa.codigo}</strong> a nombre de{' '}
              <strong>{ventaExitosa.cliente}</strong>
              <br />
              Método de pago: {ventaExitosa.metodoPago} · Total:{' '}
              <strong>{moneda(ventaExitosa.total)}</strong>
            </p>
            <div className="ventas-exito-botones">
              <button
                className="ventas-btn-cancelar"
                type="button"
                onClick={() => setVoucherVenta(ventaExitosa)}
              >
                Generar voucher PDF
              </button>
              <button className="ventas-btn-confirmar" type="button" onClick={cerrarExito}>
                Aceptar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {ventaPorCancelar && (
        <Modal titulo="Cancelar venta" onCerrar={() => setVentaPorCancelar(null)}>
          <p className="ventas-cancelar-texto">
            ¿Seguro que deseas cancelar la venta <strong>{ventaPorCancelar.codigo}</strong> de{' '}
            <strong>{ventaPorCancelar.cliente}</strong> por <strong>{moneda(ventaPorCancelar.total)}</strong>?
            La venta no se borra: quedará como <strong>Cancelado</strong> en el historial y dejará de
            contar como ingreso.
          </p>
          {errorCancelacion && (
            <p className="ventas-error" role="alert">
              {errorCancelacion}
            </p>
          )}
          <div className="ventas-botones-finales">
            <button
              className="ventas-btn-cancelar"
              type="button"
              onClick={() => setVentaPorCancelar(null)}
            >
              Volver
            </button>
            <button
              className="ventas-btn-peligro"
              type="button"
              onClick={cancelarRegistrada}
              disabled={guardando}
            >
              {guardando ? 'Cancelando...' : 'Sí, cancelar venta'}
            </button>
          </div>
        </Modal>
      )}

      {ventaPorEliminar && (
        <Modal titulo="Eliminar venta definitivamente" onCerrar={cerrarEliminacion}>
          <div className="ventas-alerta-eliminar" role="alert">
            <strong>⚠ Esta acción es permanente y no se puede deshacer.</strong>
            <p>
              Se borrará de la base de datos la venta <strong>{ventaPorEliminar.codigo}</strong> de{' '}
              <strong>{ventaPorEliminar.cliente}</strong> por{' '}
              <strong>{moneda(ventaPorEliminar.total)}</strong>, junto con todos los productos de su
              detalle. Dejará de aparecer en el historial y no podrá recuperarse.
            </p>
          </div>
          <label className="ventas-campo ventas-confirmar-campo">
            <span>
              Para confirmar, escribe el código <strong>{ventaPorEliminar.codigo}</strong>:
            </span>
            <input
              type="text"
              value={confirmacionTexto}
              onChange={(e) => setConfirmacionTexto(codigoProducto(e.target.value, 5))}
              placeholder={ventaPorEliminar.codigo}
              autoFocus
            />
          </label>
          {errorEliminacion && (
            <p className="ventas-error" role="alert">
              {errorEliminacion}
            </p>
          )}
          <div className="ventas-botones-finales">
            <button
              className="ventas-btn-cancelar"
              type="button"
              onClick={cerrarEliminacion}
              disabled={guardando}
            >
              Volver
            </button>
            <button
              className="ventas-btn-peligro"
              type="button"
              onClick={eliminarDefinitivo}
              disabled={guardando || confirmacionTexto.trim().toUpperCase() !== ventaPorEliminar.codigo}
            >
              {guardando ? 'Eliminando...' : 'Eliminar para siempre'}
            </button>
          </div>
        </Modal>
      )}

      {voucherVenta && <Voucher venta={voucherVenta} onCerrar={() => setVoucherVenta(null)} />}
    </div>
  );
}

export default Ventas;
