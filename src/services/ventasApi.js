import { peticion } from './api';
import { codigoDeProducto } from './productosApi';

// En la base de datos la venta tiene un id numérico (id_venta).
// En pantalla se muestra como código: 4 -> V0004.
export const codigoDeVenta = (id) => `V${String(id).padStart(4, '0')}`;

const formatearFecha = (iso) => {
  const [anio, mes, dia] = String(iso).slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
};

// Consulta 1 (venta + usuario): { idVenta, fecha, cliente, metodoPago, estado, total, vendedor }
export const desdeApiVenta = (v) => ({
  id: v.idVenta,
  codigo: codigoDeVenta(v.idVenta),
  fecha: formatearFecha(v.fecha),
  hora: String(v.fecha).slice(11, 16), // 'HH:mm'
  cliente: v.cliente,
  vendedor: v.vendedor ?? v.usuario?.nombre ?? '',
  metodoPago: v.metodoPago,
  total: Number(v.total),
  estado: v.estado,
});

export const listarVentas = async () => {
  const datos = await peticion('/ventas');
  return datos.map(desdeApiVenta);
};

// Consulta 2 (detalle_venta + producto):
// GET /api/ventas/{id}/detalles -> [{ idDetalle, cantidad, precioUnitario, subtotal, idProducto, nombre, marca }]
export const listarDetallesVenta = async (idVenta) => {
  const datos = await peticion(`/ventas/${idVenta}/detalles`);
  return datos.map((d) => ({
    id: d.idDetalle,
    codigo: codigoDeProducto(d.idProducto),
    nombre: d.nombre,
    marca: d.marca,
    cantidad: Number(d.cantidad),
    precioUnitario: Number(d.precioUnitario),
    subtotal: Number(d.subtotal),
  }));
};
