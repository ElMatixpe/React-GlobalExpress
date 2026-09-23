// Usuarios de prueba mientras no está conectado el backend (Spring Boot + MySQL).
// Cuando conectes la base de datos, este archivo ya no se usa: pages/Login/Login.js
// llamará al endpoint real en vez de validar contra este arreglo.

const USUARIOS_MOCK = [
  {
    usuario: 'admin',
    contrasena: 'Admin#2026',
    nombre: 'Admin123',
    rol: 'Administrador',
  },
  {
    usuario: 'elMati',
    contrasena: 'Cajero#2026',
    nombre: 'Dante Osorio',
    rol: 'Cajero',
  },
];

export default USUARIOS_MOCK;
