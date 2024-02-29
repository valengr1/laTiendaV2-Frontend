import Swal from "sweetalert2";
import styles from "./../styles/sweetalert2.module.css";

export function modalConfirmacion(datos, accion) {
  Swal.fire({
    title: datos.titulo,
    text: datos.texto,
    confirmButtonText: datos.textoBotonConfirmacion,
    confirmButtonColor: "rgb(33, 210, 254)",
    showCancelButton: true,
    cancelButtonText: datos.textoBotonCancelar,
    cancelButtonColor: "rgb(255, 0, 60)",
    customClass: styles.class,
  }).then((result) => {
    if (result.isConfirmed) {
      accion();
    }
  });
}
