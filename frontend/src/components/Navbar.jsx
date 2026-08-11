import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  // Leer los datos de la memoria del navegador
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  const cerrarSesion = (e) => {
    e.preventDefault(); // <-- Esta línea detiene el error del enlace '#'
    
    // Borramos el token y el rol de la memoria
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    cerrarMenu();
    navigate('/'); // Ahora sí te expulsará limpiamente
  };

  // Determinamos a dónde lleva el logo dependiendo del rol (o si es invitado)
  const rutaLogo = (rol === 'admin' || rol === 'vendedor') ? '/dashboard' : '/catalogo';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        
        <Link to={rutaLogo} className="navbar-logo" onClick={cerrarMenu}>
          RefaTruck
        </Link>

        <button className="hamburger-menu" onClick={toggleMenu}>
          {menuAbierto ? '✖' : '☰'}
        </button>

        <div className={`nav-links ${menuAbierto ? 'active' : ''}`}>
          
          {/* Vistas para usuarios NO LOGUEADOS (Invitados) */}
          {!token && (
            <>
              <Link to="/catalogo" onClick={cerrarMenu}>Catálogo</Link>
              <Link to="/" onClick={cerrarMenu}>Iniciar Sesión</Link>
            </>
          )}

          {/* Enlaces exclusivos para ADMIN y VENDEDOR */}
          {token && (rol === 'admin' || rol === 'vendedor') && (
            <>
              <Link to="/dashboard" onClick={cerrarMenu}>Dashboard</Link>
              <Link to="/inventario" onClick={cerrarMenu}>Inventario</Link>
              <Link to="/cotizaciones" onClick={cerrarMenu}>Cotizaciones</Link>
            
              {rol === 'admin' && (
                <Link to="/usuarios" onClick={cerrarMenu}>Usuarios</Link>
              )}
            
            </>
          )}

          {/* Enlaces exclusivos para CLIENTE LOGUEADO */}
          {token && rol === 'cliente' && (
            <>
              <Link to="/catalogo" onClick={cerrarMenu}>Catálogo</Link>
              <Link to="/cotizaciones" onClick={cerrarMenu}>Mis Pedidos</Link>
            </>
          )}

          {/* Botón de salir SOLO visible si hay una sesión activa */}
          {token && (
            <Link to="#" onClick={(e) => cerrarSesion(e)}>Salir</Link>
          )}

        </div>

      </div>
    </nav>
  );
}