import { useRef, useState } from 'react';
import { INDICADORES } from '../../data/reportesMock';
import { TrendIcon, BoxIcon, BarsIcon, CoinIcon, FileIcon } from '../Icons/icons';
import './Reportes.css';

// Icono y color de cada indicador
const ICONOS = {
  tendencia: <TrendIcon />,
  caja: <BoxIcon color="#f26522" size={22} />,
  barras: <BarsIcon />,
  moneda: <CoinIcon />,
};

const fechaHoy = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
};

// Variaciones: "+13.89%" en verde, "-4.10%" en rojo
const claseCelda = (celda) => {
  if (celda.startsWith('+')) return 'reportes-positivo';
  if (/^-\d/.test(celda)) return 'reportes-negativo';
  return '';
};

function Reportes({ usuario }) {
  const [indicadorActivo, setIndicadorActivo] = useState(3);
  const vistaPrevia = useRef(null);

  const reporte = INDICADORES.find((i) => i.id === indicadorActivo);

  const generar = (id) => {
    setIndicadorActivo(id);
    // Lleva la vista a la previsualización del documento
    setTimeout(() => {
      vistaPrevia.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  // Imprime solo el documento (ver @media print en Reportes.css).
  // En el cuadro de impresión se elige "Guardar como PDF".
  const descargarPdf = () => {
    const tituloOriginal = document.title;
    document.title = `Reporte - ${reporte.titulo}`;
    window.print();
    document.title = tituloOriginal;
  };

  return (
    <div className="reportes">
      <h2 className="reportes-titulo">Módulo de Reportes e Indicadores</h2>
      <p className="reportes-subtitulo">
        Seleccione una opción para ver un resumen y exportar el documento formal en PDF.
      </p>

      <div className="reportes-grid">
        {INDICADORES.map((ind) => (
          <div
            key={ind.id}
            className={`reportes-card${ind.id === indicadorActivo ? ' reportes-card-activa' : ''}`}
          >
            <div className={`reportes-card-icono reportes-icono-${ind.color}`}>
              {ICONOS[ind.icono]}
            </div>
            <h3 className="reportes-card-titulo">{ind.titulo}</h3>
            <p className="reportes-card-desc">{ind.descripcion}</p>
            <button className="reportes-btn" type="button" onClick={() => generar(ind.id)}>
              Generar PDF
            </button>
          </div>
        ))}
      </div>

      <section className="reportes-preview" ref={vistaPrevia}>
        <div className="reportes-preview-header">
          <h3>Vista Previa del Documento PDF</h3>
          <button className="reportes-btn reportes-btn-descarga" type="button" onClick={descargarPdf}>
            <FileIcon />
            Descargar PDF
          </button>
        </div>

        <div className="reportes-pdf">
          <div className="reportes-pdf-empresa">GLOBALEXPRESS MINIMARKET</div>
          <div className="reportes-pdf-tipo">{reporte.titulo}</div>
          <div className="reportes-pdf-meta">
            Fecha de emisión: {fechaHoy()} | Generado por: {usuario?.nombre}
          </div>

          <div className="reportes-tabla-scroll">
            <table className="reportes-tabla">
              <thead>
                <tr>
                  {reporte.columnas.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reporte.filas.map((fila) => (
                  <tr key={fila[0]}>
                    {fila.map((celda, i) => (
                      <td key={i} className={claseCelda(celda)}>
                        {celda}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Reportes;
