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

export function notificacionTarjetaNoValida() {
  toast.error("Tarjeta no válida", {
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

export function notificacionClienteYaRegistrado(response) {
  toast.error(response.data, {
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

export function notificacionClienteSeleccionado() {
  toast.success("Cliente seleccionado", {
    position: "bottom-right",
    duration: 2000,
    id: "Cliente seleccionado",
  });
}

export function notificacionDatosDeTarjetaInvalidos() {
  toast.error("Ingrese datos de tarjeta válidos", {
    position: "bottom-right",
    duration: 2000,
    id: "error",
  });
}

export function articuloEliminadoCorrectamente() {
  toast.error("Artículo eliminado correctamente", {
    position: "bottom-right",
    duration: 2000,
    id: "articulo eliminado",
  });
}

export function notificacionArticuloInexistente() {
  toast.error("Artículo inexistente", {
    position: "bottom-right",
    duration: 2000,
    id: "articulo eliminado",
  });
}

export function notificacionPositiva(texto, id) {
  toast.success(texto, {
    position: "bottom-right",
    duration: 2000,
    id: id,
  });
}

export function notificacionNegativa(texto, id) {
  toast.error(texto, {
    position: "bottom-right",
    duration: 3000,
    id: id,
  });
}
