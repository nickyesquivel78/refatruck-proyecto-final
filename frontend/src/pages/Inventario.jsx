import { useState, useEffect } from 'react';
import clienteAxios from '../config/axios';

export default function Inventario() {
  const [refacciones, setRefacciones] = useState([]);
  const [formulario, setFormulario] = useState({ nombre: '', numero_parte: '', precio: '', stock: '' });
  
  // Nuevos estados para controlar la edición
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);

  useEffect(() => {
    obtenerRefacciones();
  }, []);

  const obtenerRefacciones = async () => {
    try {
      const respuesta = await clienteAxios.get('/refacciones');
      setRefacciones(respuesta.data.data);
    } catch (error) {
      console.error("Error al cargar", error);
    }
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  // Función combinada: Guarda o Actualiza dependiendo del modo
  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await clienteAxios.put(`/refacciones/${idEdicion}`, formulario);
        alert('¡Pieza actualizada con éxito!');
      } else {
        await clienteAxios.post('/refacciones', formulario);
        alert('¡Refacción agregada con éxito!');
      }
      
      obtenerRefacciones();
      setFormulario({ nombre: '', numero_parte: '', precio: '', stock: '' });
      setModoEdicion(false);
      setIdEdicion(null);
    } catch (error) {
      alert('Error en la comunicación con el servidor.');
    }
  };

  // formulario con los datos de la pieza a editar
  const activarEdicion = (pieza) => {
    setModoEdicion(true);
    setIdEdicion(pieza.id);
    setFormulario({
      nombre: pieza.nombre,
      numero_parte: pieza.numero_parte,
      precio: pieza.precio,
      stock: pieza.stock
    });
  };

  const eliminarPieza = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta pieza de RefaTruck?')) {
      try {
        await clienteAxios.delete(`/refacciones/${id}`);
        obtenerRefacciones();
      } catch (error) {
        alert('Error al intentar eliminar.');
      }
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Gestión de Inventario</h2>
      
      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        {/* Formulario (Dinámico: Registrar o Editar) */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '320px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px' }}>
            {modoEdicion ? 'Editar Pieza' : 'Registrar Pieza'}
          </h3>
          <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={manejarCambio} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input type="text" name="numero_parte" placeholder="No. Parte" value={formulario.numero_parte} onChange={manejarCambio} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input type="number" name="precio" placeholder="Precio" value={formulario.precio} onChange={manejarCambio} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            <input type="number" name="stock" placeholder="Stock" value={formulario.stock} onChange={manejarCambio} required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            
            <button type="submit" style={{ padding: '12px', backgroundColor: modoEdicion ? '#f59e0b' : '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              {modoEdicion ? 'Actualizar Cambios' : 'Guardar Pieza'}
            </button>
            
            {modoEdicion && (
              <button type="button" onClick={() => { setModoEdicion(false); setFormulario({ nombre: '', numero_parte: '', precio: '', stock: '' }); }} style={{ padding: '10px', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                Cancelar
              </button>
            )}
          </form>
        </div>

        {/* Tabla con botones funcionales */}
        <div style={{ flex: '1', minWidth: '400px', backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: '0', marginBottom: '15px' }}>Inventario Actual</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#f1f5f9' }}>
                <tr>
                  <th style={{ padding: '12px', textAlign: 'left', borderRadius: '6px 0 0 0' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>P/N</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Precio</th>
                  {/* Agregamos la cabecera de Stock aquí */}
                  <th style={{ padding: '12px', textAlign: 'center' }}>Stock</th>
                  <th style={{ padding: '12px', textAlign: 'center', borderRadius: '0 6px 0 0' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {refacciones.map((pieza) => (
                  <tr key={pieza.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>{pieza.nombre}</td>
                    <td style={{ padding: '12px' }}>{pieza.numero_parte}</td>
                    <td style={{ padding: '12px' }}>${pieza.precio}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {pieza.stock}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <button onClick={() => activarEdicion(pieza)} style={{ padding: '6px 12px', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => eliminarPieza(pieza.id)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Borrar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}