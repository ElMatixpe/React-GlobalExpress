import './Inicio.css';

function Inicio({ usuario }) {
  return (
    <div className="inicio-wrapper">
      <div className="inicio-tarjeta">
        <p className="inicio-texto">
          ¡Bienvenido al sistema de control de venta del Minimarket "Global Express"!
        </p>
        <p className="inicio-usuario">{usuario?.nombre}</p>
        <p className="inicio-texto">
          Gestione y administre las ventas y reportes con el uso de este sistema implementado por la empresa
        </p>
      </div>
    </div>
  );
}

export default Inicio;
