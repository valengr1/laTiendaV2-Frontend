import {
  notificacionDNIInvalido,
  notificacionTelefonoInvalido,
} from "./notificaciones";
import { isValidPhoneNumber } from "libphonenumber-js";

export function validaDNI(dni) {
  var ex_regular_dni;
  ex_regular_dni = /^\d{8}(?:[-\s]\d{4})?$/;
  return ex_regular_dni.test(dni) ? true : notificacionDNIInvalido();
}

export function validaTelefono(telefono) {
  if (isValidPhoneNumber(telefono, "AR")) {
    return true;
  } else {
    return notificacionTelefonoInvalido();
  }
}
