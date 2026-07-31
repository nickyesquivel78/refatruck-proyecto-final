import { useState, useEffect } from 'react';
import clienteAxios from '../config/axios';

export default function Catalogo() {
  const [refacciones, setRefacciones] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroPrecio, setFiltroPrecio] = useState('todos');
  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null);

  useEffect(() => {
    const obtenerRefacciones = async () => {
      try {
        const respuesta = await clienteAxios.get('/refacciones');
        setRefacciones(respuesta.data.data);
      } catch (error) {
        console.error("Hubo un error al cargar el catálogo", error);
      }
    };
    obtenerRefacciones();
  }, []);

  // Lógica de filtrado múltiple (Buscador + Precio)
  const refaccionesFiltradas = refacciones.filter((pieza) => {
    // 1. Filtro por texto
    const coincideTexto = pieza.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                          pieza.numero_parte.toLowerCase().includes(busqueda.toLowerCase());
    
    // 2. Filtro por precio
    let coincidePrecio = true;
    if (filtroPrecio === 'bajos') coincidePrecio = pieza.precio < 1000;
    if (filtroPrecio === 'medios') coincidePrecio = pieza.precio >= 1000 && pieza.precio <= 5000;
    if (filtroPrecio === 'altos') coincidePrecio = pieza.precio > 5000;

    return coincideTexto && coincidePrecio;
  });

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2rem' }}>Catálogo de Refacciones</h2>
      <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '30px' }}>Encuentra la pieza exacta para tu camión.</p>

      {/* Barra de Búsqueda y Filtros */}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
        <input 
          type="text" 
          placeholder="Buscar por nombre o P/N..." 
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ flex: '1', minWidth: '250px', maxWidth: '400px', padding: '12px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
        
        <select 
          value={filtroPrecio} 
          onChange={(e) => setFiltroPrecio(e.target.value)}
          style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', cursor: 'pointer' }}
        >
          <option value="todos">Cualquier Precio</option>
          <option value="bajos">Menos de $1,000</option>
          <option value="medios">De $1,000 a $5,000</option>
          <option value="altos">Más de $5,000</option>
        </select>
      </div>

      {/* Cuadrícula de Tarjetas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
        {refaccionesFiltradas.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#94a3b8', fontSize: '1.2rem' }}>No se encontraron refacciones.</p>
        ) : (
          refaccionesFiltradas.map((pieza) => (
            <div key={pieza.id} style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: '80px', height: '80px', backgroundColor: '#f1f5f9', borderRadius: '50%', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '2rem' }}>⚙️</div>
              <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>{pieza.nombre}</h3>
              <p style={{ margin: '0 0 5px 0', color: '#64748b' }}>P/N: {pieza.numero_parte}</p>
              <p style={{ margin: '0 0 15px 0', color: '#2563eb', fontSize: '1.4rem', fontWeight: 'bold' }}>${pieza.precio}</p>
              <button onClick={() => setPiezaSeleccionada(pieza)} style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: 'auto' }}>Ver Detalles</button>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {piezaSeleccionada && (
        <div style={{ position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '2000' }}>
          <div style={{ backgroundColor: 'white', width: '90%', maxWidth: '500px', borderRadius: '12px', padding: '30px', position: 'relative' }}>
            <button onClick={() => setPiezaSeleccionada(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>✖</button>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '4rem' }}>📦</div>
              <div>
                <h2 style={{ margin: '0 0 5px 0' }}>{piezaSeleccionada.nombre}</h2>
                <span style={{ backgroundColor: '#e2e8f0', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>P/N: {piezaSeleccionada.numero_parte}</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginBottom: '25px' }}>
              <p><strong>Precio unitario:</strong> <span style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 'bold' }}>${piezaSeleccionada.precio}</span></p>
             {/* <p><strong>Stock:</strong> {piezaSeleccionada.stock} piezas</p>*/}
            </div>
            <button style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Solicitar Cotización
            </button>
          </div>
        </div>
      )}
    </div>
  );
}