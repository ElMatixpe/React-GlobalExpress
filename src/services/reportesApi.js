import { peticion } from './api';
import { codigoDeProducto } from './productosApi';

// Backend: GET /api/reportes/ventas?desde=AAAA-MM-DD&hasta=AAAA-MM-DD
// Devuelve las ventas del período con su detalle:
//   { idVenta, fecha, estado, total, detalles: [{ idProducto, nombre, marca, cantidad, subtotal }] }
// Se adapta a la forma que usan los cálculos de utils/reportes.js.
export const listarVentasReporte = async (desde, hasta) => {
  const datos = await peticion(`/reportes/ventas?desde=${desde}&hasta=${hasta}`);
  return datos.map((v) => ({
    id: v.idVenta,
    fecha: v.fecha,
    estado: v.estado,
    total: Number(v.total),
    detalles: v.detalles.map((d) => ({
      codigo: codigoDeProducto(d.idProducto),
      nombre: d.nombre,
      marca: d.marca,
      cantidad: Number(d.cantidad),
      subtotal: Number(d.subtotal),
    })),
  }));
};

// Backend: POST /api/reportes  ->  guarda en la tabla reporte quién generó el reporte,
// cuándo y para qué período. Devuelve { idReporte, fechaGeneracion, periodoInicio, periodoFin, ... }
export const registrarReporte = ({ idUsuario, periodoInicio, periodoFin }) =>
  peticion('/reportes', {
    metodo: 'POST',
    cuerpo: { idUsuario, periodoInicio, periodoFin },
  });
