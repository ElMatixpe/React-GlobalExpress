import { peticion } from './api';

// En la base de datos la venta tiene un id numérico (id_venta).
// En pantalla se muestra como código: 4 -> V0004.
export const codigoDeVenta = (id) => `V${String(id).padStart(4, '0')}`;

// El servidor envía la fecha como "2026-10-10T15:30:12": se muestra como 10/10/2026
const formatearFecha = (iso) => {
  const [anio, mes, dia] = String(iso).slice(0, 10).split('-');
  return `${dia}/${mes}/${anio}`;
};

// Backend: { idVenta, fecha, usuario:{nombre,...}, cliente, metodoPago, estado, total }
export const desdeApiVenta = (v) => ({
  id: v.idVenta,
  codigo: codigoDeVenta(v.idVenta),
  fecha: formatearFecha(v.fecha),
  cliente: v.cliente,
  vendedor: v.usuario?.nombre ?? '',
  metodoPago: v.metodoPago,
  total: Number(v.total),
  estado: v.estado,
});

export const listarVentas = async () => {
  const datos = await peticion('/ventas');
  return datos.map(desdeApiVenta);
};
