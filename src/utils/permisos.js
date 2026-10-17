// Permisos por rol (según la clase Usuario / Administrador / Cajero del diagrama UML).
// Para cambiar quién puede ver qué, basta con editar esta tabla.

export const SECCIONES_POR_ROL = {
  Administrador: ['inicio', 'ventas', 'productos', 'usuarios', 'reportes'],
  Cajero: ['inicio', 'ventas', 'productos'],
};

// Un rol desconocido no ve nada salvo el inicio
export const puedeVerSeccion = (rol, seccion) =>
  (SECCIONES_POR_ROL[rol] || ['inicio']).includes(seccion);

// Crear y editar productos: solo el Administrador. El Cajero únicamente los consulta.
export const puedeGestionarProductos = (rol) => rol === 'Administrador';
