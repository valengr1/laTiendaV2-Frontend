import toast from "react-hot-toast";
import { buscarClientePorDNI } from "../services/clienteServices";

export function validaDNI(dni, setCliente, setRegistro) {
  var ex_regular_dni;
  ex_regular_dni = /^\d{8}(?:[-\s]\d{4})?$/;
  if (ex_regular_dni.test(dni) == true) {
    buscarClientePorDNI(dni, setCliente, setRegistro);
  } else {
    toast.error("Ingrese un DNI válido", {
      position: "bottom-right",
      duration: 2000,
      id: "error",
    });
  }
}
