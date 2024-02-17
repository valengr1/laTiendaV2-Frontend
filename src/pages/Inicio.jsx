import { useNavigate } from "react-router-dom";
import styles from "./../styles/Inicio.module.css";
import { modalConfirmacion } from "../helpers/modales";
import { useEffect, useState } from "react";

function Inicio() {
  useEffect(() => {
    let legajoVendedor = window.localStorage.getItem("legajoVendedor");
    if (legajoVendedor) {
      setVendedor(true);
    } else {
      setAdministrativo(true);
    }
  }, []);
  const navigate = useNavigate();
  const [vendedor, setVendedor] = useState(false);
  const [administrativo, setAdministrativo] = useState(false);
  const cerrarSesion = (e) => {
    e.preventDefault();
    const datos = {
      titulo: "Cerrar sesión",
      texto: "Desea continuar?",
      textoBotonConfirmacion: "Cerrar sesión",
      textoBotonCancelar: "Cancelar",
    };

    const accion = () => {
      window.localStorage.clear();
      setTimeout(() => {
        navigate("/");
      }, 200);
    };
    modalConfirmacion(datos, accion);
  };
  return (
    <main className={styles.main}>
      <header>
        <button className={styles.btnCancelar} onClick={cerrarSesion}>
          <i className="fa-regular fa-circle-left"></i>
        </button>
      </header>
      <div className={styles.divBienvenida}>
        <div className={styles.divInner}>
          <h1 className={styles.h1Bienvenido}>Bienvenido</h1>
          {vendedor ? (
            <a className={styles.aNuevaVenta} href="/ventas">
              Nueva venta
            </a>
          ) : (
            <></>
          )}
          {administrativo ? (
            <a
              className={styles.aGestionarArticulos}
              href="/gestionarArticulos"
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
