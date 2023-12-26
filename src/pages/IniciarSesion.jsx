import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./../styles/IniciarSesion.module.css";
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
    <main className={styles.main}>
      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.divImg}></div>
        <div className={styles.divIniciarSesion}>
          <h1 className={styles.titulo}>Iniciar sesión</h1>
          <div>
            <label className={styles.labelLegajo}>Legajo</label>
            <input
              required
              type="number"
              name="legajo"
              onChange={(e) =>
                setVendedor({ ...vendedor, legajo: e.target.value })
              }
              className={styles.inputLegajo}
            />
          </div>
          <div>
            <label className={styles.labelContraseña}>Contraseña</label>
            <input
              required
              type="password"
              name="contraseña"
              onChange={(e) =>
                setVendedor({ ...vendedor, contraseña: e.target.value })
              }
              className={styles.inputContraseña}
            />
          </div>
          <button className={styles.buttonIniciarSesion}>Iniciar sesión</button>
        </div>
      </form>
    </main>
  );
}
export default IniciarSesion;
