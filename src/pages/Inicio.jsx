import { useLocation, useNavigate } from "react-router-dom";
import styles from "./../styles/Inicio.module.css";
import { modalConfirmacion } from "../helpers/modales";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Inicio() {
  const location = useLocation();
  const legajo = location.pathname.split("/")[2];

  useEffect(() => {
    const encargadoLegajo = location.pathname.split("/")[2];
    const getEmpleado = (legajo) => {
      axios
        .get("http://localhost:8080/api/administrativos/" + legajo)
        .then((res) => {
          console.log(res.data);
          if (res.data === "") {
            axios
              .get("http://localhost:8080/api/vendedores/" + legajo)
              .then((res) => {
                console.log(res.data);
                if (res.data === "") {
                  toast.error("No se encontró el empleado");
                } else {
                  setUsuario(res.data);
                  setVendedor(true);
                }
              });
          } else {
            setUsuario(res.data);
            setAdministrativo(true);
          }
        });
    };
    getEmpleado(encargadoLegajo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const navigate = useNavigate();
  const [vendedor, setVendedor] = useState(false);
  const [administrativo, setAdministrativo] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const cerrarSesion = (e) => {
    e.preventDefault();
    const datos = {
      titulo: "Cerrar sesión",
      texto: "Desea continuar?",
      textoBotonConfirmacion: "Cerrar sesión",
      textoBotonCancelar: "Cancelar",
    };

    const accion = () => {
      if (vendedor) {
        axios
          .delete("http://localhost:8080/api/sesiones/" + legajo)
          .then((res) => {
            console.log(res);
            if (res.data === "Sesión eliminada correctamente") {
              setTimeout(() => {
                navigate("/");
              }, 200);
            } else {
              toast.error(res.data);
            }
          });
      } else {
        setTimeout(() => {
          navigate("/");
        }, 200);
      }
    };
    modalConfirmacion(datos, accion);
  };

  return (
    <main className={styles.main}>
      <header>
        {usuario ? (
          <div className={styles.divUsuario}>
            <i className="fa-regular fa-user"></i>
            <h5 className={styles.h5Usuario}>
              {usuario.nombre} {usuario.apellido}
            </h5>
          </div>
        ) : (
          <></>
        )}
        <button className={styles.btnCancelar} onClick={cerrarSesion}>
          <i className="fa-regular fa-circle-left"></i>
        </button>
      </header>
      <div className={styles.divBienvenida}>
        <div className={styles.divInner}>
          <h1 className={styles.h1Bienvenido}>Bienvenido</h1>
          {vendedor ? (
            <a className={styles.aNuevaVenta} href={"/ventas/" + legajo}>
              Nueva venta
            </a>
          ) : (
            <></>
          )}
          {administrativo ? (
            <a
              className={styles.aGestionarArticulos}
              href={"/gestionarArticulos/" + legajo}
            >
              Gestionar artículos
            </a>
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
}
export default Inicio;
