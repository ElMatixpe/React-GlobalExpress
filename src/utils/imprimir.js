// Imprime un documento concreto de la aplicación ('reporte' o 'voucher').
// Marca el <body> con data-imprimir="<tipo>" mientras se abre el cuadro de impresión; los CSS de cada
// documento (@media print) usan esa marca para mostrar solo lo suyo. En el cuadro de impresión se
// elige "Guardar como PDF". El título de la pestaña se usa como nombre sugerido del archivo.
export function imprimirDocumento(tipo, titulo) {
  const tituloOriginal = document.title;
  document.title = titulo;
  document.body.dataset.imprimir = tipo;
  window.print();
  delete document.body.dataset.imprimir;
  document.title = tituloOriginal;
}
