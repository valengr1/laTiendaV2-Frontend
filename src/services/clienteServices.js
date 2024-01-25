import axios from "axios";
import toast from "react-hot-toast";

export function buscarClientePorDNI(dni, setCliente, setRegistro) {
  axios
    .get("http://localhost:8080/buscarCliente", {
      params: { DNI: dni },
    })
    .then((response) => {
      if (response.data === "") {
        setCliente(null);
        toast.error("Cliente no encontrado", {
          position: "bottom-right",
          duration: 2000,
          id: "error",
        });
      } else {
        toast.success("Cliente encontrado", {
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
  //validar cliente
  axios
    .post("http://localhost:8080/registrarCliente", clienteRegistro)
    .then((response) => {
      if (response.data === "Cliente registrado") {
        toast.success("Cliente registrado", {
          position: "bottom-right",
          duration: 2000,
          id: "Cliente registrado",
        });
        setRegistro(false);
      }
    });
}
