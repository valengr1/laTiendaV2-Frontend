import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./../styles/IniciarSesion.module.css";
import toast, { Toaster } from "react-hot-toast";
function IniciarSesion() {
  const [empleado, setEmpleado] = useState(null);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(
        "http://localhost:8080/api/administrativo/buscarByLegajoAndContraseña",
        {
          params: { legajo: empleado.legajo, contraseña: empleado.contraseña },
        }
      )
      .then((response) => {
        if (response.data === "No autorizado") {
          axios
            .get(
              "http://localhost:8080/api/vendedor/buscarByLegajoAndContraseña",
              {
                params: {
                  legajo: empleado.legajo,
                  contraseña: empleado.contraseña,
                },
              }
            )
            .then((response) => {
              if (response.data === "No autorizado") {
                toast.error("Legajo y/o contraseña incorrecto/a", {
                  duration: 2000,
                  id: "error",
                });
              } else {
                localStorage.setItem(
                  "legajoVendedor",
                  JSON.stringify(empleado.legajo)
                );
                toast.success(response.data, {
                  duration: 2000,
                  id: "bienvenido",
                });
                setTimeout(() => {
                  navigate("/inicio");
                }, 2000);
              }
            });
        } else {
          localStorage.setItem(
            "legajoAdministrativo",
            JSON.stringify(empleado.legajo)
          );
          toast.success(response.data, {
            duration: 2000,
            id: "bienvenido",
          });
          setTimeout(() => {
            navigate("/inicio");
          }, 2000);
        }
      });
  };
  return (
    <main className={styles.main}>
      <Toaster />
      <form onSubmit={handleSubmit} className={styles.formulario}>
        <div className={styles.divIniciarSesion}>
          <h1 className={styles.titulo}>Iniciar sesión</h1>
          <div className={styles.divLegajo}>
            <label className={styles.labelLegajo}>Legajo</label>
            <input
              required
              type="number"
              name="legajo"
              onChange={(e) =>
                setEmpleado({ ...empleado, legajo: e.target.value })
              }
              className={styles.inputLegajo}
            />
          </div>
          <div className={styles.divContraseña}>
            <label className={styles.labelContraseña}>Contraseña</label>
            <input
              required
              type="password"
              name="contraseña"
              onChange={(e) =>
                setEmpleado({ ...empleado, contraseña: e.target.value })
              }
              className={styles.inputContraseña}
            />
          </div>
          <button className={styles.buttonIniciarSesion}>Ingresar</button>
        </div>
      </form>
    </main>
  );
}
export default IniciarSesion;
