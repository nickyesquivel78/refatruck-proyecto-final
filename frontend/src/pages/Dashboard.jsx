import { useState, useEffect } from 'react';
import clienteAxios from '../config/axios';

export default function Dashboard() {
  const [refacciones, setRefacciones] = useState([]);

  // Descargamos la información de la base de datos al entrar
  useEffect(() => {
    const obtenerMetricas = async () => {
      try {
        const respuesta = await clienteAxios.get('/refacciones');
        setRefacciones(respuesta.data.data);
      } catch (error) {
        console.error("Hubo un error al cargar las métricas", error);
      }
    };
    obtenerMetricas();
  }, []);

  // Cálculos matemáticos automáticos para las tarjetas
  const totalPiezasDiferentes = refacciones.length;
  const totalStock = refacciones.reduce((total, pieza) => total + Number(pieza.stock), 0);
  const valorTotalInventario = refacciones.reduce((total, pieza) => total + (Number(pieza.precio) * Number(pieza.stock)), 0);

  return (
    <div style={{ padding: '40px 20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2rem', color: '#1f2937' }}>
        Dashboard Principal
      </h2>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '40px' }}>
        Resumen en tiempo real del sistema RefaTruck.
      </p>

      {/* Contenedor de las Tarjetas de Métricas */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* Tarjeta 1 */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minWidth: '250px', textAlign: 'center', flex: '1' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📦</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '1rem', textTransform: 'uppercase' }}>Variedad de Piezas</h3>
          <p style={{ margin: '0', color: '#2563eb', fontSize: '2.5rem', fontWeight: 'bold' }}>{totalPiezasDiferentes}</p>
        </div>

        {/* Tarjeta 2 */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minWidth: '250px', textAlign: 'center', flex: '1' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>⚙️</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '1rem', textTransform: 'uppercase' }}>Total de Artículos en Stock</h3>
          <p style={{ margin: '0', color: '#10b981', fontSize: '2.5rem', fontWeight: 'bold' }}>{totalStock}</p>
        </div>

        {/* Tarjeta 3 */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', minWidth: '250px', textAlign: 'center', flex: '1' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💰</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#6b7280', fontSize: '1rem', textTransform: 'uppercase' }}>Valor del Inventario</h3>
          <p style={{ margin: '0', color: '#f59e0b', fontSize: '2.5rem', fontWeight: 'bold' }}>
            ${valorTotalInventario.toLocaleString('es-MX')}
          </p>
        </div>

      </div>
    </div>
  );
}