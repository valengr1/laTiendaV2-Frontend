import toast from "react-hot-toast";

export function notificacionDNIInvalido() {
  toast.error("Ingrese un DNI válido", {
    position: "bottom-right",
    duration: 2000,
    id: "error",
  });
}

export function notificacionTarjetaValidada() {
  toast.success("Tarjeta validada", {
    position: "bottom-right",
    duration: 2000,
    id: "Tarjeta validada",
  });
}

export function notificacionTarjetaNoValidada() {
  toast.error("Tarjeta no validada", {
    position: "bottom-right",
    duration: 2000,
    id: "Tarjeta no validada",
  });
}

export function notificacionPagoRealizado() {
  toast.success("Pago realizado", {
    position: "bottom-right",
    duration: 2000,
    id: "Pago realizado",
  });
}

export function notificacionPagoNoRealizado() {
  toast.error("Pago no realizado", {
    position: "bottom-right",
    duration: 2000,
    id: "Pago no realizado",
  });
}

export function notificacionClienteRegistrado() {
  toast.success("Cliente registrado", {
    position: "bottom-right",
    duration: 2000,
    id: "Cliente registrado",
  });
}

export function notificacionTelefonoInvalido() {
  toast.error("Ingrese un teléfono válido", {
    position: "bottom-right",
    duration: 2000,
    id: "error",
  });
}
