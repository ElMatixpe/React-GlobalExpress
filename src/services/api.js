// Punto único de comunicación con el backend Spring Boot.
// La URL se puede cambiar creando un archivo .env con: REACT_APP_API_URL=http://localhost:8080/api
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export class ErrorApi extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.status = status;
  }
}

// peticion('/usuarios/login', { metodo: 'POST', cuerpo: { ... } })
// Devuelve el JSON de la respuesta, o lanza ErrorApi con el mensaje del servidor.
export async function peticion(ruta, { metodo = 'GET', cuerpo } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor. Verifica que el backend esté encendido.', 0);
  }

  if (res.status === 204) return null;

  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ErrorApi(datos?.mensaje || 'Ocurrió un error inesperado en el servidor.', res.status);
  }
  return datos;
}
