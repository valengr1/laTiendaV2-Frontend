import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Ventas from "./pages/Ventas";
import IniciarSesion from "./pages/IniciarSesion";
import Carrito from "./pages/Carrito";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IniciarSesion />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/carrito" element={<Carrito />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
