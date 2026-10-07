// Filtros de entrada: cada función recibe lo que escribió/pegó el usuario y
// devuelve el texto ya limpio, quitando los caracteres que no están permitidos.

const LETRAS = 'A-Za-zÁÉÍÓÚÜÑáéíóúüñ';

// Solo letras (con tildes y ñ), espacios, apóstrofe, punto y guion. Sin números.
// Ej.: "Adrian Ortiz", "María O'Brien", "Ana-Lucía"
export const soloNombre = (valor, max = 50) =>
  valor
    .replace(new RegExp(`[^${LETRAS}\\s'.-]`, 'g'), '')
    .replace(/^\s+/, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, max);

// Nombre de producto o marca: letras, números, espacios y . - & ' % /
// Ej.: "Coca Cola 1L", "Big Cola 1.5L", "Coca-Cola"
export const textoProducto = (valor, max = 50) =>
  valor
    .replace(new RegExp(`[^${LETRAS}0-9\\s.&'%/-]`, 'g'), '')
    .replace(/^\s+/, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, max);

// Nombre de usuario (login): letras sin tildes, números, punto, guion y guion bajo. Sin espacios.
export const nombreUsuario = (valor, max = 20) =>
  valor.replace(/[^A-Za-z0-9._-]/g, '').slice(0, max);

// Contraseña: sin espacios.
export const sinEspacios = (valor) => valor.replace(/\s/g, '');

// Solo dígitos (cantidades, IDs numéricos).
export const soloEnteros = (valor, max = 6) => valor.replace(/\D/g, '').slice(0, max);

// Precio: enteros o decimales con hasta 2 decimales (ej. 5, 5.5, 5.50). Sin letras ni signos.
export const soloDecimal = (valor, maxEnteros = 6) => {
  let limpio = valor.replace(',', '.').replace(/[^\d.]/g, '');
  const [entero, ...resto] = limpio.split('.');
  limpio = entero.slice(0, maxEnteros);
  if (resto.length > 0) limpio += '.' + resto.join('').slice(0, 2);
  return limpio;
};

// Código de producto (ej. P001): letras sin tildes y números, en mayúsculas.
export const codigoProducto = (valor, max = 10) =>
  valor.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, max);
