import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

function Pago() {
  const [dni, setDni] = useState("");
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    direccion: "",
    telefono: "",
    condicionTributaria: {
      descripcion: "",
      id: 0,
    },
  });
  const [registro, setRegistro] = useState(false);
  const [select, setSelect] = useState("");
  useEffect(() => {
    setCliente(null);
  }, []);

  const buscarCliente = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:8080/buscarCliente", {
        params: { DNI: dni },
      })
      .then((response) => {
        if (response.data === "") {
          setCliente(null);
          toast.error("Cliente no encontrado", {
            duration: 2000,
            id: "error",
          });
        } else {
          toast.success("Cliente encontrado", {
            duration: 2000,
            id: "Cliente encontrado",
          });
          setCliente(response.data);
          setRegistro(false);
        }
      });
  };

  const registrarCliente = () => {
    setCliente(null);
    setRegistro(true);
  };

  const cancelar = () => {
    setRegistro(false);
  };

  var stocks = [];
  const handleSelection = (e) => {
    setSelect(e.target.value);
    stocks = window.localStorage.getItem("arrayStocks");
    console.log(stocks);
  };
  return (
    <main>
      <Toaster />
      <div>
        <div>
          <div>
            <h1>Cliente</h1>
            <form onSubmit={buscarCliente}>
              <input
                onChange={(e) => setDni(e.target.value)}
                type="number"
                placeholder="DNI"
                required
                id="dni"
              />
              <button>Buscar</button>
            </form>
            <button onClick={registrarCliente}>Registrar cliente</button>
            {cliente ? (
              <div>
                <h2>Nombre: {cliente.nombre}</h2>
                <h2>Apellido: {cliente.apellido}</h2>
                <h2>DNI: {cliente.dni}</h2>
                <h2>Dirección: {cliente.direccion}</h2>
                <h2>Teléfono: {cliente.telefono}</h2>
                <h2>
                  Condición tributaria:{" "}
                  {cliente.condicionTributaria.descripcion}
                </h2>
              </div>
            ) : (
              <></>
            )}
            {registro ? (
              <div>
                <label htmlFor="">Nombre</label>
                <input type="text" />
                <label htmlFor="">Apellido</label>
                <input type="text" />
                <label htmlFor="">DNI</label>
                <input type="number" />
                <label htmlFor="">Dirección</label>
                <input type="text" />
                <label htmlFor="">Teléfono</label>
                <input type="number" />
                <label htmlFor="">Condición tributaria</label>
                <select name="" id="">
                  <option value="">Consumidor final</option>
                  <option value="">Responsable inscripto</option>
                  <option value="">Monotributista</option>
                </select>
                <div>
                  <button onClick={cancelar}>Cancelar</button>
                  <button>Registrar</button>
                </div>
              </div>
            ) : (
              <> </>
            )}
          </div>
        </div>
        <div>
          <h1>Forma de pago</h1>
          <div>
            <div>
              <label htmlFor="tarjeta">Tarjeta</label>
              <input
                onChange={handleSelection}
                type="radio"
                name="pago"
                id="tarjeta"
                value={"tarjeta"}
              />
            </div>
            <div>
              <label htmlFor="efectivo">Efectivo</label>
              <input
                onChange={handleSelection}
                type="radio"
                name="pago"
                id="efectivo"
                value={"efectivo"}
              />
            </div>
          </div>
          {select === "tarjeta" ? (
            <div>
              <label htmlFor="numeroTarjeta">Número de tarjeta</label>
              <input type="number" id="numeroTarjeta" />
              <label htmlFor="nombreTitular">Nombre del titular</label>
              <input type="text" id="nombreTitular" />
              <label htmlFor="fechaVencimiento">Fecha de vencimiento</label>
              <input type="date" id="fechaVencimiento" />
              <label htmlFor="codigoSeguridad">Código de seguridad</label>
              <input type="number" id="codigoSeguridad" />
              <button>Validar tarjeta</button>
            </div>
          ) : (
            <></>
          )}
          {select === "efectivo" ? (
            <div>
              <h3>Total: {window.localStorage.getItem("total")}</h3>
              <button>Realizar venta</button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
}

export default Pago;
