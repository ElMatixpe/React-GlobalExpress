// Ventas de prueba mientras no está conectado el backend (Spring Boot + MySQL).
// Cuando conectes la base de datos, este archivo ya no se usa: el módulo de
// Ventas llamará al endpoint real en vez de usar este arreglo.

const VENTAS_MOCK = [
  { codigo: 'V0000', fecha: '13/09/2026', cliente: 'Adrian Ortiz', vendedor: 'Darien M.', metodoPago: 'Efectivo', total: 45.9, estado: 'Pagado' },
  { codigo: 'V0001', fecha: '13/09/2026', cliente: 'Maria Torres', vendedor: 'Gustavo C.', metodoPago: 'Yape', total: 132.0, estado: 'Pagado' },
  { codigo: 'V0002', fecha: '12/09/2026', cliente: 'Luis Paredes', vendedor: 'Gustavo C.', metodoPago: 'Tarjeta', total: 28.5, estado: 'Cancelado' },
  { codigo: 'V0003', fecha: '12/09/2026', cliente: 'Rosa Quispe', vendedor: 'Darien M.', metodoPago: 'Efectivo', total: 15.0, estado: 'Cancelado' },
  { codigo: 'V0004', fecha: '11/09/2026', cliente: 'Fernando Rojas', vendedor: 'Darien M.', metodoPago: 'Efectivo', total: 30.0, estado: 'Pagado' },
];

export default VENTAS_MOCK;