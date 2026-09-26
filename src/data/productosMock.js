// Productos de prueba mientras no está conectado el backend (Spring Boot + MySQL).
// Cuando conectes la base de datos, este archivo ya no se usa: el módulo de
// Productos llamará al endpoint real en vez de usar este arreglo.

const PRODUCTOS_MOCK = [
  { codigo: 'P001', nombre: 'Coca Cola 1L', marca: 'Coca-Cola', precio: 5.5, estado: 'Disponible' },
  { codigo: 'P002', nombre: 'Inca Kola 1L', marca: 'Inca Kola', precio: 4.5, estado: 'Disponible' },
  { codigo: 'P003', nombre: 'Pepsi 1L', marca: 'Pepsi', precio: 3.5, estado: 'Disponible' },
  { codigo: 'P004', nombre: 'Guarana 1L', marca: 'Guarana', precio: 3.8, estado: 'No Disponible' },
  { codigo: 'P005', nombre: 'Big Cola 1.5L', marca: 'Big Cola', precio: 3.0, estado: 'Disponible' },
];

export default PRODUCTOS_MOCK;
