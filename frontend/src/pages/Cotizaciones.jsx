import { useState, useEffect } from 'react';
import clienteAxios from '../config/axios';

export default function Cotizaciones() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const rol = localStorage.getItem('rol');

  // Nuevos estados para el Modal de Detalles
  const [modalVisible, setModalVisible] = useState(false);
  const [detallesActivos, setDetallesActivos] = useState([]);
  const [cotizacionSeleccionada, setCotizacionSeleccionada] = useState(null);

  // Descargamos las cotizaciones reales desde Laravel
  const obtenerCotizaciones = async () => {
    try {
      const respuesta = await clienteAxios.get('/cotizaciones');
      setCotizaciones(respuesta.data);
    } catch (error) {
      console.error("Error al obtener cotizaciones", error);
    }
  };

  useEffect(() => {
    obtenerCotizaciones();
  }, []);

  // Función para aprobar o rechazar (Botones que solo ve el admin)
  const cambiarEstado = async (id, nuevoEstado) => {
    if(!window.confirm(`¿Segura que deseas marcar esta cotización como ${nuevoEstado}?`)) return;
    
    try {
      const respuesta = await clienteAxios.put(`/cotizaciones/${id}/estado`, { estado: nuevoEstado });
      alert(respuesta.data.message);
      obtenerCotizaciones(); // Recargamos la tabla
    } catch (error) {
      alert(error.response?.data?.message || "Error al actualizar estado");
    }
  };

  const verDetalle = async (cotizacion) => {
    try {
      const respuesta = await clienteAxios.get(`/cotizaciones/${cotizacion.id}`);
      setDetallesActivos(respuesta.data.detalles);
      setCotizacionSeleccionada(cotizacion);
      setModalVisible(true); // Encendemos la ventana flotante
    } catch (error) {
      alert("Error al cargar los detalles de la cotización");
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e293b' }}>
        {rol === 'cliente' ? 'Mis Pedidos y Cotizaciones' : 'Control de Cotizaciones'}
      </h2>

      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Folio</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Fecha</th>
              {/* Vendedor y Admin ven quién hizo el pedido */}
              {(rol === 'admin' || rol === 'vendedor') && <th style={{ padding: '12px', textAlign: 'left' }}>Cliente</th>}
              <th style={{ padding: '12px', textAlign: 'left' }}>Total</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Estado</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map((cot) => (
              <tr key={cot.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>COT-{cot.id}</td>
                {/* Formateamos la fecha que nos manda la base de datos MySQL */}
                <td style={{ padding: '12px' }}>{new Date(cot.created_at).toLocaleDateString()}</td>
                {(rol === 'admin' || rol === 'vendedor') && <td style={{ padding: '12px' }}>{cot.cliente}</td>}
                <td style={{ padding: '12px', color: '#16a34a', fontWeight: 'bold' }}>${cot.total}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ 
                      padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold',
                      backgroundColor: cot.estado === 'Aprobada' ? '#d1fae5' : (cot.estado === 'Rechazada' ? '#fee2e2' : '#fef3c7'), 
                      color: cot.estado === 'Aprobada' ? '#065f46' : (cot.estado === 'Rechazada' ? '#991b1b' : '#92400e') 
                    }}>
                    {cot.estado}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    
                    {/* El botón de Ver Detalle AHORA SIEMPRE ESTÁ VISIBLE para todos */}
                    <button onClick={() => verDetalle(cot)} style={{ padding: '6px 12px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                      Ver Detalle
                    </button>

                    {/* Botones de decisión SOLO para el Admin y SOLO si está Pendiente */}
                    {rol === 'admin' && cot.estado === 'Pendiente' && (
                      <>
                        <button onClick={() => cambiarEstado(cot.id, 'Aprobada')} style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          Aprobar
                        </button>
                        <button onClick={() => cambiarEstado(cot.id, 'Rechazada')} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                          Rechazar
                        </button>
                      </>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {cotizaciones.length === 0 && (
          <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b' }}>No hay cotizaciones registradas aún.</p>
        )}
      </div>

      {/* MODAL DE DETALLES (Flotante) */}
      {modalVisible && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', maxWidth: '700px', width: '90%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            
            <h3 style={{ marginTop: 0, fontSize: '1.5rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
              Detalles de Cotización: COT-{cotizacionSeleccionada?.id}
            </h3>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <p style={{ margin: 0, color: '#475569' }}><strong>Estado:</strong> {cotizacionSeleccionada?.estado}</p>
              <p style={{ margin: 0, color: '#475569' }}><strong>Total:</strong> <span style={{ color: '#16a34a', fontWeight: 'bold' }}>${cotizacionSeleccionada?.total}</span></p>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead style={{ backgroundColor: '#f1f5f9' }}>
                <tr>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Pieza</th>
                  <th style={{ padding: '10px', textAlign: 'center' }}>Cant.</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Precio U.</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {detallesActivos.map(det => (
                  <tr key={det.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px' }}>
                      <strong>{det.nombre}</strong> <br/>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>P/N: {det.numero_parte}</span>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{det.cantidad}</td>
                    <td style={{ padding: '10px', textAlign: 'right' }}>${det.precio_unitario}</td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold' }}>
                      ${(det.cantidad * det.precio_unitario).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ textAlign: 'right', marginTop: '25px' }}>
              <button onClick={() => setModalVisible(false)} style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cerrar Ventana
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}