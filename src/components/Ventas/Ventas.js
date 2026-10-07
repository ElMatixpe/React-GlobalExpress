import { useMemo, useState } from 'react';
import Modal from '../Modales/Modales';
import { SearchIcon } from '../Icons/icons';
import { soloNombre, soloEnteros, codigoProducto } from '../../utils/validaciones';
import './Ventas.css';

const METODOS_PAGO = ['Efectivo', 'Tarjeta', 'Yape', 'Plin'];

const FILTROS = [
  { key: 'exito', label: 'Con Éxito' },
  { key: 'todos', label: 'Mostrar Todo' },
  { key: 'cancelado', label: 'Cancelado' },
];

const moneda = (n) => `S/ ${Number(n).toFixed(2)}`;

// Los códigos son "V" + 4 dígitos (V0000, V0001...). Devuelve el número que sigue.
const siguienteNumero = (ventas) =>
  ventas.reduce((max, v) => Math.max(max, parseInt(v.codigo.replace(/\D/g, ''), 10) || 0), -1) + 1;

const fechaHoy = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

function Ventas({ usuario, ventas, setVentas, productos }) {
  const [vista, setVista] = useState('historial'); // 'historial' | 'nueva'

  // ---- Historial ----
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

  // ---- Nueva venta ----
  const [cliente, setCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState('Tarjeta');
  const [carrito, setCarrito] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [error, setError] = useState('');
  const [ventaExitosa, setVentaExitosa] = useState(null);
  const [modalCancelar, setModalCancelar] = useState(false);

  // ---- Modal agregar producto ----
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

  // Si ya hay productos en el carrito se pide confirmación; si no, simplemente se sale.
  const cancelarVenta = () => {
    if (carrito.length === 0) {
      limpiarNuevaVenta();
      setVista('historial');
      return;
    }
    setModalCancelar(true);
  };

  const seguirConVenta = () => setModalCancelar(false);

  // Por ahora solo visual (mock): registra la venta como Cancelado en el estado local.
  const confirmarCancelacion = () => {
    const siguiente = siguienteNumero(ventas);
    setVentas((actual) => [
      ...actual,
      {
        codigo: `V${String(siguiente).padStart(4, '0')}`,
        fecha: fechaHoy(),
        cliente: cliente.trim() || 'Cliente general',
        vendedor: usuario?.nombre || 'Vendedor',
        metodoPago,
        total,
        estado: 'Cancelado',
      },
    ]);
    setModalCancelar(false);
    limpiarNuevaVenta();
    setBusqueda('');
    setFiltro('cancelado');
    setVista('historial');
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
        { codigo: producto.codigo, nombre: producto.nombre, precio: Number(producto.precio), cantidad },
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

  // Al salir del campo, una cantidad vacía o 0 vuelve a 1.
  const normalizarCantidad = (codigo) => {
    setCarrito((actual) =>
      actual.map((i) => (i.codigo === codigo && !(i.cantidad >= 1) ? { ...i, cantidad: 1 } : i))
    );
  };

  // Por ahora solo visual (mock): guarda en el estado local, no hay backend todavía.
  const confirmarVenta = () => {
    if (carrito.length === 0) {
      setError('Agrega al menos un producto al carrito para confirmar la venta.');
      return;
    }

    if (carrito.some((i) => !(i.cantidad >= 1))) {
      setError('Todas las cantidades deben ser números enteros mayores a 0.');
      return;
    }

    const siguiente = siguienteNumero(ventas);
    const nuevaVenta = {
      codigo: `V${String(siguiente).padStart(4, '0')}`,
      fecha: fechaHoy(),
      cliente: cliente.trim() || 'Cliente general',
      vendedor: usuario?.nombre || 'Vendedor',
      metodoPago,
      total,
      estado: 'Pagado',
    };

    setVentas((actual) => [...actual, nuevaVenta]);
    setVentaExitosa(nuevaVenta);
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

          <div className="ventas-table-container">
            <table className="ventas-table">
              <thead>
                <tr>
                  <th>Codigo</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Vendedor</th>
                  <th>Metodo de Pago</th>
                  <th>Total</th>
                  <th>Estado</th>
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
                  </tr>
                ))}

                {ventasFiltradas.length === 0 && (
                  <tr>
                    <td colSpan={7} className="ventas-vacio">
                      No se encontraron ventas con esos criterios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
            <button className="ventas-btn-confirmar" type="button" onClick={confirmarVenta}>
              Confirmar Venta
            </button>
          </div>
        </div>
      )}

      {modalProductos && (
        <Modal titulo="Agregar producto" onCerrar={cerrarModalProductos} ancho={640}>
          <div className="ventas-buscador ventas-buscador-modal">
            <SearchIcon size={16} color="#777" />
            <input
              type="text"
              placeholder="Búsqueda por Id de Producto"
              value={busquedaProd}
              onChange={(e) => setBusquedaProd(codigoProducto(e.target.value))}
              autoFocus
            />
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
          <div className="ventas-botones-finales">
            <button className="ventas-btn-cancelar" type="button" onClick={seguirConVenta}>
              Seguir con la venta
            </button>
            <button className="ventas-btn-peligro" type="button" onClick={confirmarCancelacion}>
              Sí, cancelar venta
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
            <button className="ventas-btn-confirmar" type="button" onClick={cerrarExito}>
              Aceptar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Ventas;
