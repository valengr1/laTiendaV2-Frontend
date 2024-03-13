import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./../styles/IniciarSesion.module.css";
import toast, { Toaster } from "react-hot-toast";
import { notificacionNegativa } from "../helpers/notificaciones";

function IniciarSesion() {
  const [empleado, setEmpleado] = useState(null);
  const navigate = useNavigate();

  const iniciarSesion = (e) => {
    e.preventDefault();
    let legajo = empleado.legajo;
    let contrasenia = empleado.contraseña;
    let legajoInt = parseInt(legajo);
    const data = {
      legajo: legajoInt,
      contraseña: contrasenia,
    };
    axios
      .post("http://localhost:8080/api/administrativos", data)
      .then((res) => {
        console.log(res);
        if (res.data === "") {
          axios
            .post("http://localhost:8080/api/vendedores", data)
            .then((res) => {
              console.log(res.data);
              if (res.data === "") {
                notificacionNegativa(
                  "Legajo y/o contraseña incorrectos",
                  "incorrecto"
                );
              } else {
                axios
                  .post("http://localhost:8080/api/sesiones", data)
                  .then((res) => {
                    console.log(res.data);
                    if (res.data === "Sesión guardada") {
                      toast.success("Bienvenido");
                      setTimeout(() => {
                        navigate("/inicio/" + legajo);
                      }, 2000);
                    } else {
                      toast.error(res.data);
                    }
                  });
              }
            })
            .catch((error) => {
              console.log(error);
              notificacionNegativa(
                "Legajo y/o contraseña incorrectos",
                "incorrecto"
              );
            });
        } else {
          toast.success("Bienvenido");
          setTimeout(() => {
            navigate("/inicio/" + legajo);
          }, 2000);
        }
      });
  };

  return (
    <main className={styles.main}>
      <Toaster />
      <form onSubmit={iniciarSesion} className={styles.formulario}>
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
