import axios from "axios";
import toast from "react-hot-toast";
import {
  notificacionClienteRegistrado,
  notificacionClienteYaRegistrado,
} from "../helpers/notificaciones";

export function buscarClientePorDNI(dni, setCliente, setRegistro) {
  axios
    .get("http://localhost:8080/buscarCliente", {
      params: { DNI: dni },
    })
    .then((response) => {
      if (response.data === "") {
        setCliente(null);
        toast.error("Cliente inexistente", {
          position: "bottom-right",
          duration: 2000,
          id: "error",
        });
      } else {
        toast.success("Cliente existente", {
          position: "bottom-right",
          duration: 2000,
          id: "Cliente encontrado",
        });
        setCliente(response.data);
        setRegistro(false);
      }
    });
}

export function registrarCliente(clienteRegistro, setRegistro) {
  axios
    .post("http://localhost:8080/registrarCliente", clienteRegistro)
    .then((response) => {
      console.log(response.data);
      if (response.data === "Cliente registrado") {
        notificacionClienteRegistrado();
        setRegistro(false);
      } else if (
        response.data ===
        "El cliente que desea registrar ya se encuentra registrado"
      ) {
        notificacionClienteYaRegistrado(response);
      }
    });
  //desde el backend verificar si el cliente ya existe. Si existe, no se registra y se notifica. Si no existe, se registra y se notifica.
}

export const getCondicionesTributarias = (setCondicionesTributarias) => {
  axios.get("http://localhost:8080/condicionesTributarias").then((response) => {
    setCondicionesTributarias(response.data);
  });
};
