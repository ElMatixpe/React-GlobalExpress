import { useEffect, useMemo, useRef, useState } from 'react';
import { listarVentasReporte, registrarReporte } from '../../services/reportesApi';
import { imprimirDocumento } from '../../utils/imprimir';
import {
  INDICADORES,
  aISO,
  calcularKpis,
  fechaCorta,
  filtrarPorPeriodo,
  generarReporte,
  inicioMesAnterior,
  moneda,
} from '../../utils/reportes';
import { TrendIcon, BoxIcon, BarsIcon, CoinIcon, FileIcon } from '../Icons/icons';
import './Reportes.css';

// Icono de cada indicador
const ICONOS = {
  tendencia: <TrendIcon />,
  caja: <BoxIcon color="#f26522" size={22} />,
  barras: <BarsIcon />,
  moneda: <CoinIcon />,
};

// Variaciones: "+13.89%" en verde, "-4.10%" en rojo
const claseCelda = (celda) => {
  if (celda.startsWith('+')) return 'reportes-positivo';
  if (/^-\d/.test(celda)) return 'reportes-negativo';
  return '';
};

const primerDiaDeMes = (hoy, mesesAtras) => aISO(new Date(hoy.getFullYear(), hoy.getMonth() - mesesAtras, 1));

function Reportes({ usuario }) {
  const hoyFecha = useMemo(() => new Date(), []);
  const hoy = aISO(hoyFecha);

  // Período del reporte (equivale a periodoInicio / periodoFin de la tabla reporte)
  const [desde, setDesde] = useState(primerDiaDeMes(hoyFecha, 2));
  const [hasta, setHasta] = useState(hoy);
  const [indicadorActivo, setIndicadorActivo] = useState(3);
  const vistaPrevia = useRef(null);

  // Ventas que vienen de MySQL. Se piden desde el inicio del mes anterior al período
  // para poder calcular la variación del primer mes.
  const [ventasBase, setVentasBase] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [intento, setIntento] = useState(0);
  const [avisoRegistro, setAvisoRegistro] = useState(null); 

  const errorPeriodo = !desde || !hasta
    ? 'Selecciona la fecha de inicio y la fecha de fin.'
    : desde > hasta
      ? 'La fecha "Desde" no puede ser posterior a la fecha "Hasta".'
      : '';

  useEffect(() => {
    if (errorPeriodo) return undefined;
    let vigente = true; 
    setCargando(true);
    setErrorCarga('');
    listarVentasReporte(inicioMesAnterior(desde), hasta)
      .then((datos) => vigente && setVentasBase(datos))
      .catch((err) => vigente && setErrorCarga(err.message))
      .finally(() => vigente && setCargando(false));
    return () => {
      vigente = false;
    };
  }, [errorPeriodo, desde, hasta, intento]);

  const ventasPeriodo = useMemo(
    () => (errorPeriodo ? [] : filtrarPorPeriodo(ventasBase, desde, hasta)),
    [errorPeriodo, ventasBase, desde, hasta]
  );

  const kpis = useMemo(() => calcularKpis(ventasPeriodo), [ventasPeriodo]);

  const indicador = INDICADORES.find((i) => i.id === indicadorActivo);

  const reporte = useMemo(
    () =>
      errorPeriodo
        ? { columnas: [], filas: [], hayMesParcial: false, nota: '' }
        : generarReporte(indicadorActivo, ventasPeriodo, ventasBase, desde, hasta),
    [errorPeriodo, indicadorActivo, ventasPeriodo, ventasBase, desde, hasta]
  );

  const aplicarAtajo = (tipo) => {
    if (tipo === 'mes') {
      setDesde(primerDiaDeMes(hoyFecha, 0));
      setHasta(hoy);
    } else if (tipo === 'anterior') {
      setDesde(primerDiaDeMes(hoyFecha, 1));
      setHasta(aISO(new Date(hoyFecha.getFullYear(), hoyFecha.getMonth(), 0)));
    } else {
      setDesde(primerDiaDeMes(hoyFecha, 2));
      setHasta(hoy);
    }
  };

  const generar = (id) => {
    setIndicadorActivo(id);
    // Lleva la vista a la previsualización del documento
    setTimeout(() => {
      vistaPrevia.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  // exportarPDF: primero registra el reporte en la base de datos (quién, cuándo y qué período)
  // y luego exporta solo el documento pdf.
  const descargarPdf = async () => {
    if (errorPeriodo) return;
    setAvisoRegistro(null);
    try {
      const registrado = await registrarReporte({
        idUsuario: usuario?.idUsuario,
        periodoInicio: desde,
        periodoFin: hasta,
      });
      setAvisoRegistro({ tipo: 'ok', texto: `Reporte N° ${registrado.idReporte} registrado en el sistema.` });
    } catch (err) {
      setAvisoRegistro({ tipo: 'error', texto: `No se pudo registrar el reporte: ${err.message}` });
    }

    imprimirDocumento('reporte', `Reporte - ${indicador.titulo}`);
  };

  const sinVentas = kpis.cantidadPagadas === 0;

  const tarjetas = [
    {
      color: 'verde',
      etiqueta: 'Ingresos totales',
      valor: moneda(kpis.ingresos),
      detalle: `${kpis.cantidadPagadas} ventas pagadas`,
    },
    {
      color: 'azul',
      etiqueta: 'Venta máxima',
      valor: sinVentas ? '—' : moneda(kpis.maxima.total),
      detalle: sinVentas ? 'Sin ventas en el período' : `del ${fechaCorta(kpis.maxima.fecha)}`,
    },
    {
      color: 'naranja',
      etiqueta: 'Venta mínima',
      valor: sinVentas ? '—' : moneda(kpis.minima.total),
      detalle: sinVentas ? 'Sin ventas en el período' : `del ${fechaCorta(kpis.minima.fecha)}`,
    },
    {
      color: 'morado',
      etiqueta: 'Promedio por venta',
      valor: moneda(kpis.promedio),
      detalle: 'Ingresos ÷ ventas pagadas',
    },
    {
      color: 'amarillo',
      etiqueta: 'Producto más vendido',
      valor: kpis.productoTop ? kpis.productoTop.nombre : '—',
      detalle: kpis.productoTop ? `${kpis.productoTop.unidades} unidades vendidas` : 'Sin ventas en el período',
    },
    {
      color: 'rojo',
      etiqueta: 'Ventas canceladas',
      valor: String(kpis.cantidadCanceladas),
      detalle: `${moneda(kpis.montoCancelado)} no cobrados`,
    },
  ];

  return (
    <div className="reportes">
      <h2 className="reportes-titulo">Módulo de Reportes e Indicadores</h2>
      <p className="reportes-subtitulo">
        Elige el período, revisa el resumen de ventas y exporta el documento formal en PDF.
      </p>

      {/* Control por fechas */}
      <section className="reportes-periodo">
        <div className="reportes-periodo-campos">
          <label className="reportes-fecha">
            <span>Desde</span>
            <input type="date" value={desde} max={hoy} onChange={(e) => setDesde(e.target.value)} />
          </label>
          <label className="reportes-fecha">
            <span>Hasta</span>
            <input type="date" value={hasta} max={hoy} onChange={(e) => setHasta(e.target.value)} />
          </label>
        </div>

        <div className="reportes-atajos">
          <button type="button" className="reportes-atajo" onClick={() => aplicarAtajo('mes')}>
            Este mes
          </button>
          <button type="button" className="reportes-atajo" onClick={() => aplicarAtajo('anterior')}>
            Mes anterior
          </button>
          <button type="button" className="reportes-atajo" onClick={() => aplicarAtajo('3meses')}>
            Últimos 3 meses
          </button>
        </div>

        {errorPeriodo && (
          <p className="reportes-error" role="alert">
            {errorPeriodo}
          </p>
        )}
      </section>

      {cargando && !errorPeriodo && <p className="reportes-cargando">Cargando datos del período...</p>}

      {errorCarga && (
        <div className="reportes-banner-error" role="alert">
          <span>{errorCarga}</span>
          <button type="button" className="reportes-reintentar" onClick={() => setIntento((n) => n + 1)}>
            Reintentar
          </button>
        </div>
      )}

      {/* Tarjetas de resumen del período */}
      <div className="reportes-kpis">
        {tarjetas.map((t) => (
          <div key={t.etiqueta} className={`reportes-kpi reportes-kpi-${t.color}`}>
            <span className="reportes-kpi-etiqueta">{t.etiqueta}</span>
            <strong className="reportes-kpi-valor">{t.valor}</strong>
            <span className="reportes-kpi-detalle">{t.detalle}</span>
          </div>
        ))}
      </div>

      <h3 className="reportes-seccion">Indicadores</h3>

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
          <button
            className="reportes-btn reportes-btn-descarga"
            type="button"
            onClick={descargarPdf}
            disabled={Boolean(errorPeriodo)}
          >
            <FileIcon />
            Descargar PDF
          </button>
        </div>

        {avisoRegistro && (
          <p className={`reportes-aviso reportes-aviso-${avisoRegistro.tipo}`} role="status">
            {avisoRegistro.texto}
          </p>
        )}

        <div className="reportes-pdf">
          <div className="reportes-pdf-empresa">GLOBALEXPRESS MINIMARKET</div>
          <div className="reportes-pdf-tipo">{indicador.titulo}</div>
          <div className="reportes-pdf-meta">
            {errorPeriodo ? 'Período no válido' : `Período: ${fechaCorta(desde)} al ${fechaCorta(hasta)}`}
            {' | '}Fecha de emisión: {fechaCorta(hoy)} | Generado por: {usuario?.nombre}
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

                {reporte.filas.length === 0 && (
                  <tr>
                    <td colSpan={Math.max(reporte.columnas.length, 1)} className="reportes-vacio">
                      No hay ventas en el período seleccionado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {reporte.hayMesParcial && reporte.nota && <p className="reportes-nota">{reporte.nota}</p>}
        </div>
      </section>
    </div>
  );
}

export default Reportes;


