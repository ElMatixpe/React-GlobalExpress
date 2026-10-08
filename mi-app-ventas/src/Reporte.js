import React, { useState } from 'react';

function Reporte() {
  const [indicadorActivo, setIndicadorActivo] = useState(3);

  const reportesData = {
    1: {
      titulo: 'Porcentaje de Ventas por Mes (%)',
      columnas: ['Mes', 'Ventas del Mes (S/)', 'Meta Anual Estimada (S/)', 'Participación Anual (%)'],
      filas: [
        ['Julio 2026', 'S/ 18,450.00', 'S/ 200,000.00', '9.22%'],
        ['Agosto 2026', 'S/ 19,800.00', 'S/ 200,000.00', '9.90%'],
        ['Setiembre 2026', 'S/ 21,300.00', 'S/ 200,000.00', '10.65%']
      ]
    },
    2: {
      titulo: 'Porcentaje de Participación del Producto (%)',
      columnas: ['Código', 'Producto', 'Categoría', 'Unidades Vendidas', 'Participación (%)'],
      filas: [
        ['PROD-01', 'Coca Cola 1.5L', 'Bebidas', '450 u.', '24.5%'],
        ['PROD-02', 'Inca Kola 1.5L', 'Bebidas', '380 u.', '20.7%'],
        ['PROD-03', 'Arroz Superior 1kg', 'Abarrotes', '310 u.', '16.9%']
      ]
    },
    3: {
      titulo: 'Porcentaje de Variación de Ventas Mensual (%)',
      columnas: ['Período / Mes', 'Venta Mes Actual (S/)', 'Venta Mes Anterior (S/)', 'Variación (%)', 'Estado'],
      filas: [
        ['Julio 2026', 'S/ 18,450.00', 'S/ 16,200.00', '+13.89%', 'Crecimiento'],
        ['Agosto 2026', 'S/ 19,800.00', 'S/ 18,450.00', '+7.32%', 'Crecimiento'],
        ['Setiembre 2026', 'S/ 21,300.00', 'S/ 19,800.00', '+7.58%', 'Crecimiento']
      ]
    },
    4: {
      titulo: 'Promedio de Venta Mensual por Operación',
      columnas: ['Mes', 'Monto Total Ventas (S/)', 'Número de Transacciones', 'Ticket Promedio (S/)'],
      filas: [
        ['Julio 2026', 'S/ 18,450.00', '615', 'S/ 30.00'],
        ['Agosto 2026', 'S/ 19,800.00', '640', 'S/ 30.93'],
        ['Setiembre 2026', 'S/ 21,300.00', '680', 'S/ 31.32']
      ]
    }
  };

  const reporteActual = reportesData[indicadorActivo];

  return (
    <div className="layout-container">
      
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, sans-serif; }
        .layout-container { display: flex; min-height: 100vh; background-color: #f4f5f7; color: #333; }
        .sidebar { width: 250px; background-color: #d32f2f; color: white; display: flex; flex-direction: column; justify-content: space-between; flex-shrink: 0; }
        .brand-section { padding: 20px 16px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.15); }
        .brand-logo-box { width: 42px; height: 42px; background-color: #444; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 20px; color: white; }
        .brand-text h1 { font-size: 15px; font-weight: 700; color: white; margin: 0; line-height: 1.2; }
        .brand-text span { font-size: 12px; color: #ffcdd2; }
        .menu-list { list-style: none; margin-top: 15px; }
        .menu-item { display: flex; align-items: center; gap: 15px; padding: 14px 22px; color: white; font-size: 14px; cursor: pointer; }
        .menu-item.active { background-color: #e5b800; color: #1a1a1a; font-weight: 700; }
        .logout-btn { padding: 20px 22px; border-top: 1px solid rgba(255, 255, 255, 0.15); display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; }
        .main-wrapper { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
        .header { background-color: #ffffff; height: 65px; padding: 0 30px; display: flex; align-items: center; justify-content: flex-end; border-bottom: 1px solid #e0e0e0; }
        .user-profile { display: flex; align-items: center; gap: 12px; }
        .avatar-circle { width: 38px; height: 38px; border-radius: 50%; background-color: #1a73e8; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; }
        .user-name { font-size: 14px; font-weight: 700; color: #202124; }
        .user-role { font-size: 12px; color: #5f6368; }
        .content-container { padding: 25px 35px; max-width: 1200px; margin: 0 auto; width: 100%; }
        .module-title { font-size: 20px; font-weight: 700; color: #202124; margin-bottom: 4px; }
        .module-subtitle { font-size: 13px; color: #5f6368; margin-bottom: 25px; }
        .indicators-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 30px; }
        .card-indicator { background: white; border-radius: 10px; padding: 20px 16px; border: 1px solid #e0e0e0; display: flex; flex-direction: column; align-items: center; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .card-icon-box { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 12px; }
        .icon-blue { background-color: #e8f0fe; color: #1a73e8; }
        .icon-orange { background-color: #fef0e6; color: #f26522; }
        .icon-purple { background-color: #f3e8ff; color: #9333ea; }
        .icon-yellow { background-color: #fef9c3; color: #ca8a04; }
        .card-title { font-size: 13px; font-weight: 700; color: #202124; min-height: 36px; display: flex; align-items: center; justify-content: center; }
        .card-desc { font-size: 11px; color: #5f6368; margin-bottom: 16px; min-height: 32px; line-height: 1.3; }
        .btn-indigo { width: 100%; padding: 9px 12px; border: none; border-radius: 6px; background-color: #3f51b5; color: white; font-weight: 600; font-size: 12px; cursor: pointer; transition: background-color 0.2s; }
        .btn-indigo:hover { background-color: #303f9f; }
        .preview-section { background: white; border-radius: 10px; padding: 24px; border: 1px solid #e0e0e0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .preview-title { font-size: 16px; font-weight: 700; color: #202124; }
        .btn-download-pdf { background-color: #3f51b5; color: white; padding: 9px 16px; border-radius: 6px; border: none; font-weight: 600; font-size: 12px; cursor: pointer; }
        .pdf-paper { border: 1px solid #e0e0e0; padding: 25px; background-color: #ffffff; border-radius: 4px; }
        .pdf-company-name { font-size: 15px; font-weight: 800; color: #202124; }
        .pdf-report-type { font-size: 13px; font-weight: 700; color: #3c4043; margin-top: 4px; }
        .pdf-meta-date { font-size: 11px; color: #70757a; margin-bottom: 20px; }
        .custom-table { width: 100%; border-collapse: collapse; text-align: left; }
        .custom-table th { background-color: #e5b800; color: #1a1a1a; font-size: 12px; font-weight: 700; padding: 10px 14px; }
        .custom-table td { padding: 10px 14px; font-size: 12px; color: #3c4043; border-bottom: 1px solid #f1f3f4; }
        .badge-positive { color: #188038; font-weight: 700; }
      `}</style>

     
      <aside className="sidebar">
        <div>
          <div className="brand-section">
            <div className="brand-logo-box"></div>
            <div className="brand-text">
              <h1>GLOBAL EXPRESS</h1>
              <span>Minimarket</span>
            </div>
          </div>

          <ul className="menu-list">
            <li className="menu-item"><span> Inicio</span></li>
            <li className="menu-item"><span> Ventas</span></li>
            <li className="menu-item"><span> Productos</span></li>
            <li className="menu-item"><span> Usuarios</span></li>
            <li className="menu-item active"><span> Reportes</span></li>
          </ul>
        </div>

        <div className="logout-btn">
          <span>Cerrar Sesión</span>
        </div>
      </aside>

      
      <div className="main-wrapper">
        <header className="header">
          <div className="user-profile">
            <div className="avatar-circle">A</div>
            <div>
              <div className="user-name">Admin123</div>
              <div className="user-role">Administrador</div>
            </div>
          </div>
        </header>

        <main className="content-container">
          <div className="module-header">
            <h2 className="module-title">Módulo de Reportes e Indicadores</h2>
            <p className="module-subtitle">Seleccione una opción para ver un resumen y exportar el documento formal en PDF.</p>
          </div>

          
          <div className="indicators-grid">
            <div className="card-indicator">
              <div className="card-icon-box icon-blue">📈</div>
              <h3 className="card-title">Porcentaje de Ventas por Mes (%)</h3>
              <p className="card-desc">Mide el porcentaje que representan las ventas del mes respecto al total del año.</p>
              <button className="btn-indigo" onClick={() => setIndicadorActivo(1)}>Generar PDF</button>
            </div>

            <div className="card-indicator">
              <div className="card-icon-box icon-orange">📦</div>
              <h3 className="card-title">Porcentaje de Participación del Producto (%)</h3>
              <p className="card-desc">Mide las unidades vendidas de un producto respecto al total del mes.</p>
              <button className="btn-indigo" onClick={() => setIndicadorActivo(2)}>Generar PDF</button>
            </div>

            <div className="card-indicator">
              <div className="card-icon-box icon-purple">📊</div>
              <h3 className="card-title">Porcentaje de Variación de Ventas Mensual (%)</h3>
              <p className="card-desc">Mide la variación porcentual de las ventas comparadas con el mes anterior.</p>
              <button className="btn-indigo" onClick={() => setIndicadorActivo(3)}>Generar PDF</button>
            </div>

            <div className="card-indicator">
              <div className="card-icon-box icon-yellow">💰</div>
              <h3 className="card-title">Promedio de Venta Mensual por Operación</h3>
              <p className="card-desc">Calcula el monto promedio generado por cada venta realizada en el mes.</p>
              <button className="btn-indigo" onClick={() => setIndicadorActivo(4)}>Generar PDF</button>
            </div>
          </div>

          
          <div className="preview-section">
            <div className="preview-header">
              <h3 className="preview-title">Vista Previa del Documento PDF</h3>
              <button className="btn-download-pdf" onClick={() => window.print()}>
                📄 Descargar PDF
              </button>
            </div>

            <div className="pdf-paper">
              <div className="pdf-header">
                <div className="pdf-company-name">GLOBALEXPRESS MINIMARKET</div>
                <div className="pdf-report-type">{reporteActual.titulo}</div>
                <div className="pdf-meta-date">Fecha de emisión: 01/10/2026 | Generado por: Admin123</div>
              </div>

              
              <table className="custom-table">
                <thead>
                  <tr>
                    {reporteActual.columnas.map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reporteActual.filas.map((fila, rowIndex) => (
                    <tr key={rowIndex}>
                      {fila.map((celda, colIndex) => (
                        <td key={colIndex} className={celda.includes('+') ? 'badge-positive' : ''}>
                          {celda}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Reporte;