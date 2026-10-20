// Punto único de comunicación con el backend Spring Boot
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export class ErrorApi extends Error {
  constructor(mensaje, status) {
    super(mensaje);
    this.status = status;
  }
}

// Token de sesión que entrega el login. Vive solo en memoria: al recargar la página hay que volver a entrar.
let token = null;
export const guardarToken = (nuevo) => {
  token = nuevo;
};

// App.js registra aquí qué hacer cuando el servidor dice que la sesión ya no es valida
let alExpirarSesion = null;
export const registrarAlExpirarSesion = (funcion) => {
  alExpirarSesion = funcion;
};

// Devuelve el JSON de la respuesta, o lanza ErrorApi con el mensaje del servidor.
export async function peticion(ruta, { metodo = 'GET', cuerpo } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    });
  } catch {
    throw new ErrorApi('No se pudo conectar con el servidor. Verifica que el backend esté encendido.', 0);
  }

  if (res.status === 204) return null;

  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    // fuera del login = el token venció o el backend se reinicio: vuelve a la pantalla de login
    if (res.status === 401 && ruta !== '/usuarios/login' && alExpirarSesion) {
      alExpirarSesion();
    }
    const porDefecto =
      res.status === 401
        ? 'Tu sesión expiró. Vuelve a iniciar sesión.'
        : res.status === 403
          ? 'No tienes permiso para realizar esta acción.'
          : 'Ocurrió un error inesperado en el servidor.';
    throw new ErrorApi(datos?.mensaje || porDefecto, res.status);
  }
  return datos;
}
