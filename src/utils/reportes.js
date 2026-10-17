// Cálculos de los reportes e indicadores. Reciben la lista de ventas y devuelven números / filas.
// Solo las ventas "Pagado" cuentan como ingresos. Las "Cancelado" se informan aparte.
//   calcularTotalVentasMes           -> totales por mes (indicadores 1 y 4) y "ingresos" en calcularKpis
//   obtenerProductoTop               -> productoTop en calcularKpis
//   exportarPDF                      -> botón "Descargar PDF" del módulo
export const NOMBRES_MES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Setiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

// Redondea "como en la escuela" (9.225 -> 9.23). Evita el error de coma flotante
// de Math.round(n * 100) / 100 y de toFixed (que daban 9.22).
export const redondear = (n, decimales = 2) => {
  const signo = n < 0 ? -1 : 1;
  const absoluto = Math.abs(n);
  const r = Number(Math.round(Number(`${absoluto}e${decimales}`)) + `e-${decimales}`);
  return Number.isFinite(r) ? signo * r : signo * Math.round(absoluto * 10 ** decimales) / 10 ** decimales;
};

export const moneda = (n) =>
  `S/ ${redondear(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const porcentaje = (n) => `${redondear(n).toFixed(2)}%`;

const variacionTexto = (n) => `${redondear(n) > 0 ? '+' : ''}${redondear(n).toFixed(2)}%`;

// Fechas (siempre texto 'AAAA-MM-DD' para evitar problemas de zona horaria) 
export const aISO = (fecha) => {
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mm}-${dd}`;
};

export const fechaCorta = (iso) => {
  const [a, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${a}`;
};

const mesDe = (iso) => iso.slice(0, 7); 

const etiquetaMes = (ym) => {
  const [a, m] = ym.split('-');
  return `${NOMBRES_MES[Number(m) - 1]} ${a}`;
};

// Primer día del mes anterior a la fecha dada
export const inicioMesAnterior = (iso) => `${mesAnteriorDe(mesDe(iso))}-01`;

const mesAnteriorDe = (ym) => {
  const [a, m] = ym.split('-').map(Number);
  return m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, '0')}`;
};

const mesesEntre = (desde, hasta) => {
  const lista = [];
  let actual = mesDe(desde);
  const ultimo = mesDe(hasta);
  while (actual <= ultimo) {
    lista.push(actual);
    const [a, m] = actual.split('-').map(Number);
    actual = m === 12 ? `${a + 1}-01` : `${a}-${String(m + 1).padStart(2, '0')}`;
  }
  return lista;
};

// Un mes es "parcial" si el período elegido no lo cubre completo (ej. el mes en curso)
const esMesParcial = (ym, desde, hasta) => {
  const [a, m] = ym.split('-').map(Number);
  const ultimoDia = new Date(a, m, 0).getDate();
  return desde > `${ym}-01` || hasta < `${ym}-${String(ultimoDia).padStart(2, '0')}`;
};

const diasDelMes = (ym) => {
  const [a, m] = ym.split('-').map(Number);
  return new Date(a, m, 0).getDate();
};

const dosDigitos = (n) => String(n).padStart(2, '0');

// Días del mes que entran en el período: [primer día, último día] como número de día
const ventanaDelMes = (ym, desde, hasta) => {
  const primero = desde > `${ym}-01` ? Number(desde.slice(8, 10)) : 1;
  const ultimoMes = diasDelMes(ym);
  const ultimo = hasta < `${ym}-${dosDigitos(ultimoMes)}` ? Number(hasta.slice(8, 10)) : ultimoMes;
  return [primero, ultimo];
};

// Filtros y totales
export const filtrarPorPeriodo = (ventas, desde, hasta) =>
  ventas.filter((v) => {
    const dia = v.fecha.slice(0, 10);
    return dia >= desde && dia <= hasta;
  });

const pagadas = (ventas) => ventas.filter((v) => v.estado === 'Pagado');
const suma = (ventas) => ventas.reduce((acc, v) => acc + Number(v.total), 0);

// Totales por mes: solo con ventas pagadas
const totalesPorMes = (ventas) => {
  const mapa = {};
  pagadas(ventas).forEach((v) => {
    const ym = mesDe(v.fecha);
    mapa[ym] = mapa[ym] || { total: 0, transacciones: 0 };
    mapa[ym].total += Number(v.total);
    mapa[ym].transacciones += 1;
  });
  return mapa;
};

//Tarjetas: ingresos, máximo, mínimo, promedio, canceladas 
export function calcularKpis(ventasPeriodo) {
  const ok = pagadas(ventasPeriodo);
  const canceladas = ventasPeriodo.filter((v) => v.estado === 'Cancelado');
  const ingresos = suma(ok);

  let maxima = null;
  let minima = null;
  ok.forEach((v) => {
    if (!maxima || Number(v.total) > Number(maxima.total)) maxima = v;
    if (!minima || Number(v.total) < Number(minima.total)) minima = v;
  });

  // Producto más vendido (en unidades) del período
  const unidades = {};
  ok.forEach((v) => {
    (v.detalles || []).forEach((d) => {
      unidades[d.codigo] = unidades[d.codigo] || { codigo: d.codigo, nombre: d.nombre, unidades: 0 };
      unidades[d.codigo].unidades += Number(d.cantidad);
    });
  });
  const productoTop =
    Object.values(unidades).sort((a, b) => b.unidades - a.unidades || a.codigo.localeCompare(b.codigo))[0] || null;

  return {
    ingresos,
    productoTop,
    cantidadPagadas: ok.length,
    maxima,
    minima,
    promedio: ok.length ? ingresos / ok.length : 0,
    cantidadCanceladas: canceladas.length,
    montoCancelado: suma(canceladas),
  };
}

//Indicadores
const NOTA_PARCIAL = '* Mes parcial: solo incluye las ventas dentro del período seleccionado.';

export const INDICADORES = [
  {
    id: 1,
    color: 'azul',
    icono: 'tendencia',
    titulo: 'Porcentaje de Ventas por Mes (%)',
    descripcion: 'Qué parte del total vendido en el período corresponde a cada mes.',
  },
  {
    id: 2,
    color: 'naranja',
    icono: 'caja',
    titulo: 'Porcentaje de Participación del Producto (%)',
    descripcion: 'Unidades vendidas de cada producto respecto al total de unidades del período.',
  },
  {
    id: 3,
    color: 'morado',
    icono: 'barras',
    titulo: 'Porcentaje de Variación de Ventas Mensual (%)',
    descripcion: 'Cuánto subió o bajó la venta de cada mes frente al mes anterior.',
  },
  {
    id: 4,
    color: 'amarillo',
    icono: 'moneda',
    titulo: 'Promedio de Venta Mensual por Operación',
    descripcion: 'Monto promedio (ticket) de cada venta realizada en el mes.',
  },
];

/**
 * Devuelve { columnas, filas, hayMesParcial } del indicador pedido.
 * - ventasPeriodo: ventas dentro del rango de fechas elegido.
 * - todasLasVentas: todas las ventas (sirve para tomar el mes anterior completo en la variación).
 */
export function generarReporte(idIndicador, ventasPeriodo, todasLasVentas, desde, hasta) {
  const meses = mesesEntre(desde, hasta);
  const porMes = totalesPorMes(ventasPeriodo);
  const etiqueta = (ym) => etiquetaMes(ym) + (esMesParcial(ym, desde, hasta) ? ' *' : '');
  const hayMesParcial = meses.some((ym) => esMesParcial(ym, desde, hasta));

  if (idIndicador === 1) {
    // Participación = ventas del mes / total de ventas del período x 100
    const totalPeriodo = suma(pagadas(ventasPeriodo));
    return {
      hayMesParcial,
      nota: NOTA_PARCIAL,
      columnas: ['Mes', 'Ventas del Mes (S/)', 'Total del Período (S/)', 'Participación (%)'],
      filas: meses.map((ym) => {
        const total = porMes[ym]?.total || 0;
        return [etiqueta(ym), moneda(total), moneda(totalPeriodo), porcentaje(totalPeriodo ? (total / totalPeriodo) * 100 : 0)];
      }),
    };
  }

  if (idIndicador === 2) {
    // Participación = unidades del producto / total de unidades vendidas x 100
    const productos = {};
    let totalUnidades = 0;
    pagadas(ventasPeriodo).forEach((v) => {
      (v.detalles || []).forEach((d) => {
        productos[d.codigo] = productos[d.codigo] || { codigo: d.codigo, nombre: d.nombre, marca: d.marca, unidades: 0 };
        productos[d.codigo].unidades += Number(d.cantidad);
        totalUnidades += Number(d.cantidad);
      });
    });
    const lista = Object.values(productos)
      .sort((a, b) => b.unidades - a.unidades || a.codigo.localeCompare(b.codigo))
      .slice(0, 10);
    return {
      hayMesParcial: false,
      nota: '',
      columnas: ['Código', 'Producto', 'Marca', 'Unidades Vendidas', 'Participación (%)'],
      filas: lista.map((p) => [p.codigo, p.nombre, p.marca, `${p.unidades} u.`, porcentaje((p.unidades / totalUnidades) * 100)]),
    };
  }

  if (idIndicador === 3) {
    // Variación = (mes actual - mes anterior) / mes anterior x 100
    // Si el mes es parcial (ej. el mes en curso) se compara con los MISMOS DÍAS del mes anterior,
    // para no comparar 11 días contra un mes completo.
    const pagadasTodas = pagadas(todasLasVentas);
    return {
      hayMesParcial,
      nota: '* Mes parcial: se compara con los mismos días del mes anterior.',
      columnas: ['Período / Mes', 'Venta Mes Actual (S/)', 'Venta Mes Anterior (S/)', 'Variación (%)', 'Estado'],
      filas: meses.map((ym) => {
        const actual = porMes[ym]?.total || 0;
        const previo = mesAnteriorDe(ym);
        const tope = diasDelMes(previo);
        // Mes completo -> mes anterior completo. Mes parcial -> mismos días del mes anterior.
        const [dia1, dia2] = esMesParcial(ym, desde, hasta) ? ventanaDelMes(ym, desde, hasta) : [1, tope];
        const inicioPrevio = `${previo}-${dosDigitos(Math.min(dia1, tope))}`;
        const finPrevio = `${previo}-${dosDigitos(Math.min(dia2, tope))}`;
        const anterior = suma(filtrarPorPeriodo(pagadasTodas, inicioPrevio, finPrevio));
        if (!anterior) return [etiqueta(ym), moneda(actual), moneda(0), '—', 'Sin referencia'];
        const variacion = redondear(((actual - anterior) / anterior) * 100);
        const estado = variacion > 0 ? 'Crecimiento' : variacion < 0 ? 'Decrecimiento' : 'Sin cambio';
        return [etiqueta(ym), moneda(actual), moneda(anterior), variacionTexto(variacion), estado];
      }),
    };
  }

  // Indicador 4: ticket promedio = monto total del mes / número de ventas del mes
  return {
    hayMesParcial,
    nota: NOTA_PARCIAL,
    columnas: ['Mes', 'Monto Total Ventas (S/)', 'Número de Transacciones', 'Ticket Promedio (S/)'],
    filas: meses.map((ym) => {
      const { total = 0, transacciones = 0 } = porMes[ym] || {};
      return [etiqueta(ym), moneda(total), String(transacciones), moneda(transacciones ? total / transacciones : 0)];
    }),
  };
}

