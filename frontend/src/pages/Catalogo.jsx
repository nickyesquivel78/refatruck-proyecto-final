import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clienteAxios from '../config/axios';

export default function Catalogo() {
  const [refacciones, setRefacciones] = useState([]);
  const [carrito, setCarrito] = useState([]);
  
  // Misión 1: Verificamos si hay alguien logeado
  const estaLogeado = !!localStorage.getItem('token');

  useEffect(() => {
    const obtenerRefacciones = async () => {
      try {
        const respuesta = await clienteAxios.get('/refacciones');
        const listaDePiezas = respuesta.data.data ? respuesta.data.data : respuesta.data;
        
        if (Array.isArray(listaDePiezas)) {
            setRefacciones(listaDePiezas);
        } else {
            setRefacciones([]); 
        }
      } catch (error) {
        console.error("Error al cargar el catálogo", error);
        setRefacciones([]); 
      }
    };
    obtenerRefacciones();
  }, []);

  const agregarAlCarrito = (pieza) => {
    setCarrito((carritoActual) => {
      const existe = carritoActual.find(item => item.id === pieza.id);
      if (existe) {
        return carritoActual.map(item => 
          item.id === pieza.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...carritoActual, { ...pieza, cantidad: 1 }];
    });
  };

  const modificarCantidad = (id, accion) => {
    setCarrito((carritoActual) => {
      return carritoActual.map(item => {
        if (item.id === id) {
          // Ya no limitamos por el stock, dejamos que coticen lo que necesiten
          if (accion === 'sumar') {
            return { ...item, cantidad: item.cantidad + 1 };
          }
          if (accion === 'restar' && item.cantidad > 1) {
            return { ...item, cantidad: item.cantidad - 1 };
          }
        }
        return item;
      });
    });
  };

  const eliminarDelCarrito = (id) => {
    setCarrito((carritoActual) => carritoActual.filter(item => item.id !== id));
  };

  const totalCarrito = carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);

  // Misión 3 (Frontend): Función para enviar el carrito a Laravel
  const enviarCotizacion = async () => {
    try {
      // Preparamos el paquete exacto que Laravel necesita
      const paquete = {
        total: totalCarrito,
        detalles: carrito.map(item => ({
          refaccion_id: item.id,
          cantidad: item.cantidad,
          precio_unitario: item.precio
        }))
      };

      // Hacemos la petición POST a la API (Ruta que crearemos en Laravel)
      const respuesta = await clienteAxios.post('/cotizaciones', paquete);
      
      alert("¡Cotización enviada con éxito! Pendiente de aprobación.");
      setCarrito([]); // Vaciamos el carrito tras el éxito
    } catch (error) {
      alert("Hubo un error al enviar la cotización.");
      console.error(error);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
      
      {/* SECCIÓN IZQUIERDA: EL CATÁLOGO (Misión 2: Restaurado) */}
      <div style={{ flex: '1 1 60%', minWidth: '300px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#1e293b' }}>Catálogo de Refacciones</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
          {refacciones.map((pieza) => (
            <div key={pieza.id} style={{ border: '1px solid #e2e8f0', padding: '15px', borderRadius: '8px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>{pieza.nombre}</h3>
                <span style={{ backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>P/N: {pieza.numero_parte || 'N/A'}</span>
                {/* Aquí está la descripción que querías mantener */}
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '10px' }}>{pieza.descripcion}</p>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                <p style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '1.2rem', margin: '0 0 15px 0' }}>${pieza.precio}</p>
                
                {/* Misión 1: Candado para visitantes */}
                {estaLogeado ? (
                  <button 
                    onClick={() => agregarAlCarrito(pieza)}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Agregar a Cotización
                  </button>
                ) : (
                  <Link to="/" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '10px', backgroundColor: '#f1f5f9', color: '#2563eb', border: '1px solid #cbd5e1', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
                    Cotizar
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECCIÓN DERECHA: EL CARRITO (Misión 1: Oculto si no hay sesión) */}
      {estaLogeado && (
        <div style={{ flex: '1 1 30%', minWidth: '300px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', height: 'fit-content', position: 'sticky', top: '20px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#1e293b' }}>Tu Cotización</h2>
          
          {carrito.length === 0 ? (
            <p style={{ color: '#6b7280', textAlign: 'center' }}>Tu carrito está vacío</p>
          ) : (
            <div>
              {carrito.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '10px', marginBottom: '10px' }}>
                  <div>
                    <h4 style={{ margin: '0', color: '#0f172a', fontSize: '0.95rem' }}>{item.nombre}</h4>
                    <p style={{ margin: '0', color: '#16a34a', fontWeight: 'bold', fontSize: '0.85rem' }}>${item.precio} c/u</p>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button onClick={() => modificarCantidad(item.id, 'restar')} style={{ padding: '2px 8px', cursor: 'pointer', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px' }}>-</button>
                    <span style={{ fontWeight: 'bold' }}>{item.cantidad}</span>
                    <button onClick={() => modificarCantidad(item.id, 'sumar')} style={{ padding: '2px 8px', cursor: 'pointer', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px' }}>+</button>
                    <button onClick={() => eliminarDelCarrito(item.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '5px', fontSize: '1.1rem' }}>✖</button>
                  </div>
                </div>
              ))}
              
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #cbd5e1' }}>
                <h3 style={{ display: 'flex', justifyContent: 'space-between', color: '#0f172a' }}>
                  Total: <span style={{ color: '#16a34a' }}>${totalCarrito.toFixed(2)}</span>
                </h3>
                
                {/* El botón que ejecuta la función Misión 3 */}
                <button 
                  onClick={enviarCotizacion}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)' }}
                >
                  Enviar a Cotización
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}