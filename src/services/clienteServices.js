import axios from "axios";
import toast from "react-hot-toast";
import {
  notificacionNegativa,
  notificacionPositiva,
} from "../helpers/notificaciones";
import { modalConfirmacion } from "../helpers/modales";

export function buscarClientePorDNI(dni, setCliente, setRegistro) {
  axios
    .get("http://localhost:8080/api/cliente/buscarByDNI", {
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
  const datos = {
    titulo: "Registrar nuevo cliente",
    texto: "Estás seguro que deseas registrarlo?",
    textoBotonConfirmacion: "Agregar",
    textoBotonCancelar: "Cancelar",
  };

  const accion = () => {
    axios
      .post("http://localhost:8080/api/cliente/registrar", clienteRegistro)
      .then((response) => {
        console.log(response.data);
        if (response.data === "Cliente registrado") {
          notificacionPositiva(response.data, "positivo");
          setTimeout(() => {
            setRegistro(false);
          }, 2000);
        } else {
          notificacionNegativa(response.data, "negativo");
        }
      });
  };
  modalConfirmacion(datos, accion);
}

export const getCondicionesTributarias = (setCondicionesTributarias) => {
  axios
    .get("http://localhost:8080/api/condicionTributaria/listar")
    .then((response) => {
      setCondicionesTributarias(response.data);
    });
};
