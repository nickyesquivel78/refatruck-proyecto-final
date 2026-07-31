import { useState } from 'react';

export default function Cotizaciones() {
  // Simulador de roles para que pruebes la vista
  const [vistaActual, setVistaActual] = useState('cliente');

  // Datos simulados para la interfaz
  const [cotizaciones, setCotizaciones] = useState([
    { id: 'COT-001', fecha: '2026-07-28', cliente: 'Transportes Rápidos', total: 4500, estado: 'Pendiente' },
    { id: 'COT-002', fecha: '2026-07-25', cliente: 'Mecánica Gral', total: 12500, estado: 'Aprobada' },
  ]);

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Selector de Vistas (Solo para desarrollo) */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', gap: '10px' }}>
        <button onClick={() => setVistaActual('cliente')} style={{ padding: '10px 20px', backgroundColor: vistaActual === 'cliente' ? '#2563eb' : '#e2e8f0', color: vistaActual === 'cliente' ? 'white' : 'black', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Vista Cliente </button>
        <button onClick={() => setVistaActual('vendedor')} style={{ padding: '10px 20px', backgroundColor: vistaActual === 'vendedor' ? '#10b981' : '#e2e8f0', color: vistaActual === 'vendedor' ? 'white' : 'black', border: 'none', borderRadius: '20px', cursor: 'pointer' }}>Vista Vendedor </button>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        {vistaActual === 'cliente' ? 'Mis Cotizaciones y Órdenes' : 'Gestión de Cotizaciones (Vendedor)'}
      </h2>

      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Folio</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
              {vistaActual === 'vendedor' && <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>}
              <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map((cot) => (
              <tr key={cot.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{cot.id}</td>
                <td style={{ padding: '12px' }}>{cot.fecha}</td>
                {vistaActual === 'vendedor' && <td style={{ padding: '12px' }}>{cot.cliente}</td>}
                <td style={{ padding: '12px' }}>${cot.total}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', backgroundColor: cot.estado === 'Aprobada' ? '#d1fae5' : '#fef3c7', color: cot.estado === 'Aprobada' ? '#065f46' : '#92400e' }}>
                    {cot.estado}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {vistaActual === 'vendedor' && cot.estado === 'Pendiente' ? (
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Aprobar</button>
                      <button style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Rechazar</button>
                    </div>
                  ) : (
                    <button style={{ padding: '6px 12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ver Detalle</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}