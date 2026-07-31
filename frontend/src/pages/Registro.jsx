import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clienteAxios from '../config/axios';

export default function Registro() {
  const [formulario, setFormulario] = useState({ name: '', email: '', password: '', telefono: '' });
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await clienteAxios.post('/registro', formulario);
      
      // Guardar sesión y redirigir automáticamente al catálogo
      localStorage.setItem('token', respuesta.data.access_token);
      localStorage.setItem('rol', respuesta.data.user.rol);
      
      alert(respuesta.data.message);
      navigate('/catalogo');
    } catch (error) {
      alert('Hubo un error en el registro. Verifica tus datos.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '450px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0f172a' }}>Crear Cuenta</h2>
        
        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#64748b' }}>Nombre Completo</label>
            <input type="text" name="name" value={formulario.name} onChange={manejarCambio} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#64748b' }}>Correo Electrónico</label>
            <input type="email" name="email" value={formulario.email} onChange={manejarCambio} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: '1' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#64748b' }}>Teléfono</label>
              <input type="text" name="telefono" value={formulario.telefono} onChange={manejarCambio} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
            <div style={{ flex: '1' }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#64748b' }}>Contraseña</label>
              <input type="password" name="password" value={formulario.password} onChange={manejarCambio} required minLength="6" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>
          
          <button type="submit" style={{ padding: '14px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' }}>
            Registrarme
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '0.9rem' }}>
          ¿Ya tienes cuenta? <Link to="/" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}