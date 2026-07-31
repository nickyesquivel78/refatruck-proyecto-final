import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Catalogo from './pages/Catalogo';
import Inventario from './pages/Inventario';
import Cotizaciones from './pages/Cotizaciones';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios'; // <-- Asegúrate de que esta línea exista
import RutaProtegida from './components/RutaProtegida';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/catalogo" element={<Catalogo />} />

        {/* Rutas Privadas para ADMIN y VENDEDOR */}
        <Route element={<RutaProtegida rolPermitido={['admin', 'vendedor']} />}>
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Rutas Privadas EXCLUSIVAS para ADMIN */}
        <Route element={<RutaProtegida rolPermitido={['admin']} />}>
          <Route path="/usuarios" element={<Usuarios />} />
        </Route>

        {/* Rutas Privadas para CUALQUIER usuario logueado */}
        <Route element={<RutaProtegida />}>
          <Route path="/cotizaciones" element={<Cotizaciones />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;