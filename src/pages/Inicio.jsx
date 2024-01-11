import styles from "./../styles/Inicio.module.css";

function Inicio() {
  return (
    <main className={styles.main}>
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
