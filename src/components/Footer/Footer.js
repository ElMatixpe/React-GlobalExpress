import { PhoneIcon, MailIcon } from '../Icons/icons';
import './Footer.css';
import Modal from '../Modales/Modales';
import { useState } from 'react';

const TELEFONO_SOPORTE = '+51 977 955 999';
const CORREO_SOPORTE = 'soporte@globalexpress.com.pe';

const TEXTO_TERMINOS = `Al utilizar el sistema web de control de ventas del minimarket “Global Express”, 
el usuario acepta utilizar la plataforma de manera responsable y únicamente para las funciones correspondientes a su rol. 
El usuario será responsable de ingresar correctamente la información de las ventas, verificar los precios, 
cantidades, montos de pago y datos registrados antes de confirmar cada operación. Asimismo, deberá mantener la confidencialidad 
de sus credenciales de acceso y no compartirlas con terceros. La información registrada en el sistema será utilizada para el 
control de las ventas, consultas y generación de reportes del establecimiento. Queda prohibida la modificación, eliminación o 
manipulación no autorizada de la información almacenada. El uso del sistema implica la aceptación de estos términos y condiciones.`;

const TEXTO_PRIVACIDAD = `El sistema web de control de ventas del minimarket “Global Express” protege la información 
registrada por los usuarios y utiliza los datos únicamente para fines relacionados con la gestión, control y consulta de las 
ventas realizadas en el establecimiento. Los datos personales y credenciales de acceso serán tratados de manera responsable y 
no deberán ser compartidos con personas no autorizadas. La información almacenada podrá ser utilizada para generar reportes y 
facilitar el seguimiento de las operaciones comerciales. El usuario acepta que sus datos sean registrados y utilizados para el 
funcionamiento adecuado del sistema, manteniendo las medidas necesarias para preservar su confidencialidad y seguridad.`;

function Footer() {
  const [modalAbierto, setModalAbierto] = useState(null); 

  return (
    <footer className="app-footer">
      <div className="footer-soporte">
        <a className="footer-contacto" href={`tel:${TELEFONO_SOPORTE}`}>
          <PhoneIcon /> {TELEFONO_SOPORTE}
        </a>
        <a className="footer-contacto" href={`mailto:${CORREO_SOPORTE}`}>
          <MailIcon /> {CORREO_SOPORTE}
        </a>
      </div>

      <div className="footer-legal">
        <button type="button" className="footer-link" onClick={() => setModalAbierto('terminos')}>
          Términos y condiciones
        </button>
        <span className="footer-separador">|</span>
        <button type="button" className="footer-link" onClick={() => setModalAbierto('privacidad')}>
          Políticas de privacidad
        </button>
      </div>

      <span className="footer-copy">© {new Date().getFullYear()} Global Express Minimarket</span>

      {modalAbierto === 'terminos' && (
        <Modal titulo="Términos y condiciones" onCerrar={() => setModalAbierto(null)}>
          <p style={{ whiteSpace: 'pre-line' }}>{TEXTO_TERMINOS}</p>
        </Modal>
      )}

      {modalAbierto === 'privacidad' && (
        <Modal titulo="Políticas de privacidad" onCerrar={() => setModalAbierto(null)}>
          <p style={{ whiteSpace: 'pre-line' }}>{TEXTO_PRIVACIDAD}</p>
        </Modal>
      )}
    </footer>
  );
}

export default Footer;