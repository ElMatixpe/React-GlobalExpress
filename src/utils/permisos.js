// Permisos por rol 
export const SECCIONES_POR_ROL = {
  Administrador: ['inicio', 'ventas', 'productos', 'usuarios', 'reportes'],
  Cajero: ['inicio', 'ventas', 'productos'],
};

// Un rol desconocido no ve nada salvo el inicio
export const puedeVerSeccion = (rol, seccion) =>
  (SECCIONES_POR_ROL[rol] || ['inicio']).includes(seccion);

// Crear y editar productos: solo el Administrador. El Cajero únicamente los consulta.
export const puedeGestionarProductos = (rol) => rol === 'Administrador';

// Eliminar de forma permanente una venta cancelada: solo el Administrador.
export const puedeEliminarVentas = (rol) => rol === 'Administrador';
