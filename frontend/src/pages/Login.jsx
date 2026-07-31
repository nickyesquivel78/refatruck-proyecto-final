import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import clienteAxios from '../config/axios';

export default function Login() {
  const [formulario, setFormulario] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await clienteAxios.post('/login', formulario);
      
      // 1. Guardar el Token y el Rol en la memoria del navegador
      localStorage.setItem('token', respuesta.data.access_token);
      localStorage.setItem('rol', respuesta.data.user.rol);
      
      alert(respuesta.data.message);
      
      // 2. Redirigir según el rol del usuario
      if (respuesta.data.user.rol === 'admin' || respuesta.data.user.rol === 'vendedor') {
        navigate('/inventario');
      } else {
        navigate('/catalogo');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error al intentar iniciar sesión.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#0f172a' }}>Iniciar Sesión</h2>
        
        <form onSubmit={manejarEnvio} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#64748b' }}>Correo Electrónico</label>
            <input 
              type="email" name="email" value={formulario.email} onChange={manejarCambio} required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', color: '#64748b' }}>Contraseña</label>
            <input 
              type="password" name="password" value={formulario.password} onChange={manejarCambio} required
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
          </div>
          <button type="submit" style={{ padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px' }}>
            Entrar a RefaTruck
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#64748b', fontSize: '0.9rem' }}>
          ¿No tienes cuenta? <Link to="/registro" style={{ color: '#2563eb', fontWeight: 'bold', textDecoration: 'none' }}>Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}