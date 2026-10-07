import { useMemo, useState } from 'react';
import Modal from '../Modales/Modales';
import { SearchIcon } from '../Icons/icons';
import { textoProducto, soloDecimal, codigoProducto } from '../../utils/validaciones';
import './Productos.css';

const PRODUCTO_VACIO = { nombre: '', marca: '', estado: 'Disponible', precio: '' };

// El listado de productos vive en Home para compartirlo con el módulo de Ventas.
function Productos({ productos, setProductos }) {
  const [busqueda, setBusqueda] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null); // null = "nuevo producto"
  const [form, setForm] = useState(PRODUCTO_VACIO);
  const [error, setError] = useState('');

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return productos;
    return productos.filter((p) => p.codigo.toLowerCase().includes(texto));
  }, [productos, busqueda]);

  const abrirNuevo = () => {
    setProductoEditar(null);
    setForm(PRODUCTO_VACIO);
    setError('');
    setModalAbierto(true);
  };

  const abrirEditar = (producto) => {
    setProductoEditar(producto);
    setForm({
      nombre: producto.nombre,
      marca: producto.marca,
      estado: producto.estado,
      precio: String(producto.precio),
    });
    setError('');
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditar(null);
    setForm(PRODUCTO_VACIO);
  };

  const actualizarCampo = (campo, valor) => {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setError('');
  };

  // Por ahora solo visual (mock): guarda en el estado local, no hay backend todavía.
  const guardarProducto = (e) => {
    e.preventDefault();

    const nombre = form.nombre.trim();
    const marca = form.marca.trim();
    const precio = Number(form.precio);

    if (!nombre || !marca) {
      setError('El nombre y la marca son obligatorios.');
      return;
    }
    if (!form.precio || Number.isNaN(precio) || precio <= 0) {
      setError('Ingresa un precio válido mayor a 0 (ej. 5 o 5.50).');
      return;
    }

    if (productoEditar) {
      setProductos((actual) =>
        actual.map((p) =>
          p.codigo === productoEditar.codigo
            ? { ...p, nombre, marca, estado: form.estado, precio }
            : p
        )
      );
    } else {
      const siguienteNumero = productos.length + 1;
      const nuevoCodigo = `P${String(siguienteNumero).padStart(3, '0')}`;
      setProductos((actual) => [
        ...actual,
        {
          codigo: nuevoCodigo,
          nombre,
          marca,
          estado: form.estado,
          precio,
        },
      ]);
    }

    cerrarModal();
  };

  return (
    <div className="productos">
      <div className="productos-toolbar">
        <button className="productos-btn-catalogo" type="button">
          Catálogo
        </button>
        <button className="productos-btn-nuevo" type="button" onClick={abrirNuevo}>
          Nuevo Producto
        </button>
      </div>

      <div className="productos-buscador">
        <SearchIcon size={16} color="#777" />
        <input
          type="text"
          placeholder="Búsqueda por Id de Producto"
          value={busqueda}
          onChange={(e) => setBusqueda(codigoProducto(e.target.value))}
        />
      </div>

      <div className="productos-table-container">
        <table className="productos-table">
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Producto</th>
              <th>Marca</th>
              <th>Precio</th>
              <th>Estado</th>
              <th className="productos-col-acciones"></th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p) => (
              <tr key={p.codigo}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.marca}</td>
                <td>{Number(p.precio).toFixed(2)}</td>
                <td>
                  <span
                    className={`productos-estado ${
                      p.estado === 'Disponible' ? 'productos-estado-disponible' : 'productos-estado-no-disponible'
                    }`}
                  >
                    {p.estado}
                  </span>
                </td>
                <td className="productos-col-acciones">
                  <button className="productos-btn-editar" type="button" onClick={() => abrirEditar(p)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}

            {productosFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="productos-vacio">
                  No se encontraron productos con ese código.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <Modal
          titulo={productoEditar ? 'Editar producto' : 'Registrar nuevo producto'}
          onCerrar={cerrarModal}
        >
          <form className="productos-form" onSubmit={guardarProducto} noValidate>
            <div className="productos-form-grid">
              <label className="productos-campo">
                <span>Nombre del producto</span>
                <input
                  type="text"
                  placeholder="Ingrese Nombre:"
                  value={form.nombre}
                  onChange={(e) => actualizarCampo('nombre', textoProducto(e.target.value))}
                  required
                />
              </label>

              <label className="productos-campo">
                <span>Marca</span>
                <input
                  type="text"
                  placeholder="Ej . CocaCola"
                  value={form.marca}
                  onChange={(e) => actualizarCampo('marca', textoProducto(e.target.value, 30))}
                  required
                />
              </label>

              <label className="productos-campo">
                <span>Estado</span>
                <select value={form.estado} onChange={(e) => actualizarCampo('estado', e.target.value)}>
                  <option value="Disponible">Disponible</option>
                  <option value="No Disponible">No Disponible</option>
                </select>
              </label>

              <div className="productos-campo productos-campo-vacio" aria-hidden="true" />

              <label className="productos-campo">
                <span>Precio</span>
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={form.precio}
                  onChange={(e) => actualizarCampo('precio', soloDecimal(e.target.value))}
                />
              </label>
            </div>

            {error && (
              <p className="productos-error" role="alert">
                {error}
              </p>
            )}

            <div className="productos-dialog-botones">
              <button className="productos-btn-cancelar" type="button" onClick={cerrarModal}>
                Cancelar
              </button>
              <button className="productos-btn-guardar" type="submit">
                Guardar producto
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Productos;
