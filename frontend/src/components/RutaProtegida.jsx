import { Navigate, Outlet } from 'react-router-dom';

export default function RutaProtegida({ rolPermitido }) {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Si no hay token, lo mandamos a iniciar sesión
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si la ruta exige un rol específico (ej. 'admin' o 'vendedor') y el usuario no lo tiene
  if (rolPermitido && !rolPermitido.includes(rol)) {
    return <Navigate to="/catalogo" replace />; // Lo mandamos a un lugar seguro
  }

  // Si todo está bien, le permitimos ver el componente
  return <Outlet />;
}