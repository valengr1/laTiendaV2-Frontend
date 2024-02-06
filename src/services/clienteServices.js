import axios from "axios";
import toast from "react-hot-toast";
import { notificacionClienteRegistrado } from "../helpers/notificaciones";

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

export function registrarCliente(clienteRegistro) {
  axios
    .post("http://localhost:8080/registrarCliente", clienteRegistro)
    .then((response) => {
      console.log(response.data);
      if (response.data === "Cliente registrado") {
        notificacionClienteRegistrado();
      }
    });
}

export const getCondicionesTributarias = (setCondicionesTributarias) => {
  axios.get("http://localhost:8080/condicionesTributarias").then((response) => {
    setCondicionesTributarias(response.data);
  });
};
