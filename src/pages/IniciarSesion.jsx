import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function IniciarSesion() {
  const [vendedor, setVendedor] = useState({
    legajo: 0,
    contraseña: "",
  });

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:8080/vendedor", {
        params: { legajo: vendedor.legajo, contraseña: vendedor.contraseña },
      })
      .then((response) => {
        if (response.data === "Usuario y/o contraseña incorrecto/a") {
          alert(response.data);
        } else {
          alert(response.data);
          navigate("/inicio");
        }
      });
  };
  return (
    <main>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="">Legajo</label>
        <input
          required
          type="number"
          name="legajo"
          onChange={(e) => setVendedor({ ...vendedor, legajo: e.target.value })}
        />
        <label htmlFor="">Contraseña</label>
        <input
          required
          type="password"
          name="contraseña"
          onChange={(e) =>
            setVendedor({ ...vendedor, contraseña: e.target.value })
          }
        />
        <button>Iniciar sesión</button>
      </form>
    </main>
  );
}
export default IniciarSesion;
