// Datos de prueba de los reportes mientras no está conectado el backend
// (Spring Boot + MySQL). Cuando exista el endpoint, este archivo se reemplaza
// por la respuesta del servidor con la misma estructura.

export const INDICADORES = [
  {
    id: 1,
    color: 'azul',
    icono: 'tendencia',
    titulo: 'Porcentaje de Ventas por Mes (%)',
    descripcion: 'Mide el porcentaje que representan las ventas del mes respecto al total del año.',
    columnas: ['Mes', 'Ventas del Mes (S/)', 'Meta Anual Estimada (S/)', 'Participación Anual (%)'],
    filas: [
      ['Julio 2026', 'S/ 18,450.00', 'S/ 200,000.00', '9.22%'],
      ['Agosto 2026', 'S/ 19,800.00', 'S/ 200,000.00', '9.90%'],
      ['Setiembre 2026', 'S/ 21,300.00', 'S/ 200,000.00', '10.65%'],
    ],
  },
  {
    id: 2,
    color: 'naranja',
    icono: 'caja',
    titulo: 'Porcentaje de Participación del Producto (%)',
    descripcion: 'Mide las unidades vendidas de un producto respecto al total del mes.',
    columnas: ['Código', 'Producto', 'Categoría', 'Unidades Vendidas', 'Participación (%)'],
    filas: [
      ['PROD-01', 'Coca Cola 1.5L', 'Bebidas', '450 u.', '24.5%'],
      ['PROD-02', 'Inca Kola 1.5L', 'Bebidas', '380 u.', '20.7%'],
      ['PROD-03', 'Arroz Superior 1kg', 'Abarrotes', '310 u.', '16.9%'],
    ],
  },
  {
    id: 3,
    color: 'morado',
    icono: 'barras',
    titulo: 'Porcentaje de Variación de Ventas Mensual (%)',
    descripcion: 'Mide la variación porcentual de las ventas comparadas con el mes anterior.',
    columnas: ['Período / Mes', 'Venta Mes Actual (S/)', 'Venta Mes Anterior (S/)', 'Variación (%)', 'Estado'],
    filas: [
      ['Julio 2026', 'S/ 18,450.00', 'S/ 16,200.00', '+13.89%', 'Crecimiento'],
      ['Agosto 2026', 'S/ 19,800.00', 'S/ 18,450.00', '+7.32%', 'Crecimiento'],
      ['Setiembre 2026', 'S/ 21,300.00', 'S/ 19,800.00', '+7.58%', 'Crecimiento'],
    ],
  },
  {
    id: 4,
    color: 'amarillo',
    icono: 'moneda',
    titulo: 'Promedio de Venta Mensual por Operación',
    descripcion: 'Calcula el monto promedio generado por cada venta realizada en el mes.',
    columnas: ['Mes', 'Monto Total Ventas (S/)', 'Número de Transacciones', 'Ticket Promedio (S/)'],
    filas: [
      ['Julio 2026', 'S/ 18,450.00', '615', 'S/ 30.00'],
      ['Agosto 2026', 'S/ 19,800.00', '640', 'S/ 30.93'],
      ['Setiembre 2026', 'S/ 21,300.00', '680', 'S/ 31.32'],
    ],
  },
];
