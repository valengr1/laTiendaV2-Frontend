import { useNavigate } from "react-router-dom";
import styles from "./../styles/Inicio.module.css";

function Inicio() {
  const navigate = useNavigate();
  return (
    <main className={styles.main}>
      <header>
        <button
          className={styles.btnCancelar}
          onClick={() => {
            navigate("/");
          }}
        >
          <i className="fa-regular fa-circle-left"></i>
        </button>
      </header>
      <div className={styles.divBienvenida}>
        <div className={styles.divInner}>
          <h1 className={styles.h1Bienvenido}>Bienvenido</h1>
          <a className={styles.aNuevaVenta} href="/ventas">
            Nueva venta
          </a>
        </div>
      </div>
    </main>
  );
}
export default Inicio;
