import { peticion } from './api';

// En la base de datos el producto tiene un id numérico (id_producto).
// En pantalla se muestra como código: 1 -> P001, 12 -> P012.
export const codigoDeProducto = (id) => `P${String(id).padStart(3, '0')}`;

// Backend: { idProducto, nombre, marca, precio, estado }  ->  formato que usa el React
export const desdeApiProducto = (p) => ({
  id: p.idProducto,
  codigo: codigoDeProducto(p.idProducto),
  nombre: p.nombre,
  marca: p.marca,
  precio: Number(p.precio),
  estado: p.estado,
});

export const listarProductos = async () => {
  const datos = await peticion('/productos');
  return datos.map(desdeApiProducto);
};
