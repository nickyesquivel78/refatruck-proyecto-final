import { useState, useEffect } from 'react';
import clienteAxios from '../config/axios';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  // Descargamos la lista de usuarios al abrir la pantalla
  const obtenerUsuarios = async () => {
    try {
      const respuesta = await clienteAxios.get('/usuarios');
      setUsuarios(respuesta.data);
    } catch (error) {
      console.error("Hubo un error al cargar los usuarios", error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Función para enviar el nuevo rol al backend
  const manejarCambioRol = async (id, nuevoRol) => {
    // Pequeña confirmación de seguridad
    if (!window.confirm(`¿Estás segura de cambiar los permisos a ${nuevoRol}?`)) return;

    try {
      const respuesta = await clienteAxios.put(`/usuarios/${id}/rol`, { rol: nuevoRol });
      alert(respuesta.data.message);
      obtenerUsuarios(); // Recargamos la tabla para ver el cambio reflejado
    } catch (error) {
      alert(error.response?.data?.message || "Error al actualizar permisos.");
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '2rem', color: '#1f2937' }}>
        Gestión de Usuarios
      </h2>
      <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px' }}>
        Panel de administrador para control de accesos.
      </p>

      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f1f5f9' }}>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Correo</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Teléfono</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Rol Actual</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Acciones </th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{user.name}</td>
                <td style={{ padding: '12px' }}>{user.email}</td>
                <td style={{ padding: '12px' }}>{user.telefono || 'N/A'}</td>
                <td style={{ padding: '12px', textAlign: 'center', textTransform: 'capitalize' }}>
                  <span style={{ 
                    padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', 
                    backgroundColor: user.rol === 'admin' ? '#fee2e2' : user.rol === 'vendedor' ? '#d1fae5' : '#e0e7ff', 
                    color: user.rol === 'admin' ? '#991b1b' : user.rol === 'vendedor' ? '#065f46' : '#3730a3' 
                  }}>
                    {user.rol}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {/* Desactivamos el botón del rol que ya tiene para que no lo presionen por error */}
                  <button 
                    disabled={user.rol === 'cliente'} 
                    onClick={() => manejarCambioRol(user.id, 'cliente')}
                    style={{ padding: '6px 10px', backgroundColor: user.rol === 'cliente' ? '#cbd5e1' : '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: user.rol === 'cliente' ? 'not-allowed' : 'pointer' }}>
                    Cliente
                  </button>
                  <button 
                    disabled={user.rol === 'vendedor'} 
                    onClick={() => manejarCambioRol(user.id, 'vendedor')}
                    style={{ padding: '6px 10px', backgroundColor: user.rol === 'vendedor' ? '#cbd5e1' : '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: user.rol === 'vendedor' ? 'not-allowed' : 'pointer' }}>
                    Vendedor
                  </button>
                  <button 
                    disabled={user.rol === 'admin'} 
                    onClick={() => manejarCambioRol(user.id, 'admin')}
                    style={{ padding: '6px 10px', backgroundColor: user.rol === 'admin' ? '#cbd5e1' : '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: user.rol === 'admin' ? 'not-allowed' : 'pointer' }}>
                    Admin
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}