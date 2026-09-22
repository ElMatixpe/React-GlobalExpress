import './Modal_Footer.css';

function Modal({ titulo, onCerrar, children }) {
  const detenerPropagacion = (e) => e.stopPropagation();

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal-caja" onClick={detenerPropagacion}>
        <div className="modal-encabezado">
          <h3>{titulo}</h3>
          <button className="modal-cerrar" onClick={onCerrar} type="button" aria-label="Cerrar">
            ×
          </button>
        </div>
        <div className="modal-contenido">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
