export const LONGITUD_MIN_CONTRASENA = 8;
export const LONGITUD_MAX_CONTRASENA = 12;

// Reglas de la contraseña: mínimo 8 posiciones, máximo 12, 1 mayúscula,
// 1 minúscula, 1 dígito y 1 símbolo especial.
// Devuelve un mensaje de error, o '' si la contraseña es válida.
export function validarFormatoContrasena(valor) {
  if (valor.length < LONGITUD_MIN_CONTRASENA) return `La contraseña debe tener al menos ${LONGITUD_MIN_CONTRASENA} caracteres.`;
  if (valor.length > LONGITUD_MAX_CONTRASENA) return `La contraseña no debe superar los ${LONGITUD_MAX_CONTRASENA} caracteres.`;
  if (!/[A-Z]/.test(valor)) return 'La contraseña debe incluir al menos una letra mayúscula.';
  if (!/[a-z]/.test(valor)) return 'La contraseña debe incluir al menos una letra minúscula.';
  if (!/\d/.test(valor)) return 'La contraseña debe incluir al menos un dígito.';
  if (!/[^A-Za-z0-9]/.test(valor)) return 'La contraseña debe incluir al menos un símbolo especial.';
  return '';
}
