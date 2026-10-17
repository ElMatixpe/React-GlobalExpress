import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Modal from '../Modales/Modales';
import { listarDetallesVenta } from '../../services/ventasApi';
import { imprimirDocumento } from '../../utils/imprimir';
import { moneda } from '../../utils/reportes';
import logo from '../../Imagenes/logo.jpg';
import './Voucher.css';

// Documento del voucher. Se dibuja dos veces: en la vista previa del modal y en una copia
// oculta que es la que realmente se imprime (así el PDF sale limpio, sin ventanas encima).
function Documento({ venta, detalles }) {
  const cancelada = venta.estado === 'Cancelado';
  return (
    <div className="voucher-doc">
      <div className="voucher-cabecera">
        <div className="voucher-empresa">
          <img src={logo} alt="" className="voucher-logo" />
          <div>
            <div className="voucher-empresa-nombre">GLOBAL EXPRESS</div>
            <div className="voucher-empresa-sub">Minimarket</div>
            <div className="voucher-empresa-contacto">
              Tel. +51 977 955 999 · soporte@globalexpress.com.pe
            </div>
          </div>
        </div>
        <div className="voucher-numero">
          <div className="voucher-titulo">COMPROBANTE DE VENTA</div>
          <div className="voucher-codigo">N° {venta.codigo}</div>
        </div>
      </div>

      {cancelada && <div className="voucher-cancelada">VENTA CANCELADA</div>}

      <div className="voucher-datos">
        <div><span>Fecha:</span> {venta.fecha}</div>
        <div><span>Hora:</span> {venta.hora}</div>
        <div><span>Cliente:</span> {venta.cliente}</div>
        <div><span>Vendedor:</span> {venta.vendedor}</div>
        <div><span>Método de pago:</span> {venta.metodoPago}</div>
        <div><span>Estado:</span> {venta.estado}</div>
      </div>

      <table className="voucher-tabla">
        <thead>
          <tr>
            <th>Código</th>
            <th>Producto</th>
            <th className="voucher-num">Cant.</th>
            <th className="voucher-num">P. Unit.</th>
            <th className="voucher-num">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => (
            <tr key={d.id}>
              <td>{d.codigo}</td>
              <td>
                {d.nombre}
                <small> · {d.marca}</small>
              </td>
              <td className="voucher-num">{d.cantidad}</td>
              <td className="voucher-num">{moneda(d.precioUnitario)}</td>
              <td className="voucher-num">{moneda(d.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="voucher-total">
        <span>TOTAL</span>
        <strong>{moneda(venta.total)}</strong>
      </div>

      <div className="voucher-pie">
        <p>¡Gracias por su compra!</p>
        <small>Comprobante interno de venta. No es una factura electrónica válida ante SUNAT.</small>
      </div>
    </div>
  );
}

function Voucher({ venta, onCerrar }) {
  const [detalles, setDetalles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let vigente = true;
    listarDetallesVenta(venta.id)
      .then((datos) => vigente && setDetalles(datos))
      .catch((err) => vigente && setError(err.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [venta.id]);

  const descargar = () => imprimirDocumento('voucher', `Voucher ${venta.codigo} - ${venta.cliente}`);

  return (
    <Modal titulo={`Voucher ${venta.codigo}`} onCerrar={onCerrar} ancho={780}>
      {cargando && <p className="voucher-estado">Cargando datos de la venta...</p>}
      {error && <p className="voucher-estado voucher-estado-error" role="alert">{error}</p>}

      {!cargando && !error && (
        <>
          <div className="voucher-vista">
            <Documento venta={venta} detalles={detalles} />
          </div>
          {/* Copia que se imprime (oculta en pantalla) */}
          {createPortal(
            <div className="voucher-print">
              <Documento venta={venta} detalles={detalles} />
            </div>,
            document.body
          )}
        </>
      )}

      <div className="voucher-botones">
        <button type="button" className="voucher-btn-secundario" onClick={onCerrar}>
          Cerrar
        </button>
        <button
          type="button"
          className="voucher-btn-pdf"
          onClick={descargar}
          disabled={cargando || Boolean(error)}
        >
          Descargar PDF
        </button>
      </div>
    </Modal>
  );
}

export default Voucher;
