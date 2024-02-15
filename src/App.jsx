import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Ventas from "./pages/Ventas";
import IniciarSesion from "./pages/IniciarSesion";
import Pago from "./pages/Pago";
import GestionarArticulos from "./pages/GestionarArticulos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IniciarSesion />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/gestionarArticulos" element={<GestionarArticulos />} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
