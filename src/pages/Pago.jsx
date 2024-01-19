import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Pago.module.css";

function Pago() {
  const navigate = useNavigate();
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
  const [lineasVenta, setLineasVenta] = useState([]);
  useEffect(() => {
    setCliente(null);
    const lineasVenta = JSON.parse(localStorage.getItem("arrayStocks"));
    if (lineasVenta) {
      setLineasVenta(lineasVenta);
    }
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

  const registrarCliente = (e) => {
    e.preventDefault();
    setCliente(null);
    setRegistro(true);
  };

  const cancelar = () => {
    setRegistro(false);
  };
  const handleSelection = (e) => {
    setSelect(e.target.value);
  };

  const cancelarVenta = () => {
    window.localStorage.removeItem("arrayStocks");
    window.localStorage.removeItem("total");
    navigate("/ventas");
  };
  return (
    <main className={styles.main}>
      <Toaster />
      <div className={styles.divPrincipal}>
        <div className={styles.divRegistroYVentaOuter}>
          <header className={styles.header}>
            <button className={styles.buttonHeader} onClick={cancelarVenta}>
              <i className="fa-regular fa-circle-left"></i>
            </button>
          </header>
          <div className={styles.divRegistroYVenta}>
            <div className={styles.divClienteYRegistro}>
              <h3 className={styles.H1Cliente}>Cliente</h3>
              <form
                className={styles.formBuscarCliente}
                onSubmit={buscarCliente}
              >
                <input
                  onChange={(e) => setDni(e.target.value)}
                  type="number"
                  placeholder="DNI"
                  required
                  id="dni"
                />
                <button>Buscar</button>
                <button
                  className={styles.btnRegistrarCliente}
                  onClick={registrarCliente}
                >
                  Añadir
                </button>
                {cliente ? (
                  <section className={styles.divClienteEncontrado}>
                    <h3>Nombre: {cliente.nombre}</h3>
                    <h3>Apellido: {cliente.apellido}</h3>
                    <h3>DNI: {cliente.dni}</h3>
                    <h3>Dirección: {cliente.direccion}</h3>
                    <h3>Teléfono: {cliente.telefono}</h3>
                    <h3>
                      Condición tributaria:{" "}
                      {cliente.condicionTributaria.descripcion}
                    </h3>
                  </section>
                ) : (
                  <></>
                )}
                {registro ? (
                  <form className={styles.divRegistroCliente}>
                    <div className={styles.divPares}>
                      <input required placeholder="Nombre" type="text" />
                      <input required placeholder="Apellido" type="text" />
                    </div>
                    <div className={styles.divPares}>
                      <input required placeholder="DNI" type="number" />
                      <input required placeholder="Dirección" type="text" />
                    </div>
                    <div className={styles.divPares}>
                      <input required placeholder="Teléfono" type="number" />

                      <select
                        className={styles.divCondicionTributaria}
                        name=""
                        id=""
                      >
                        <option value="">Condición tributaria</option>
                        <option value="">Consumidor final</option>
                        <option value="">Responsable inscripto</option>
                        <option value="">Monotributista</option>
                      </select>
                    </div>
                    <div className={styles.divBotonera}>
                      <button className={styles.btnCancelar} onClick={cancelar}>
                        Cancelar
                      </button>
                      <button className={styles.btnRegistrar}>Registrar</button>
                    </div>
                  </form>
                ) : (
                  <> </>
                )}
              </form>
            </div>
            <div className={styles.divFormaPago}>
              <h3>Pago</h3>
              <div className={styles.divFormaPagoInner}>
                <div className={styles.divSelección}>
                  <div className={styles.divTarjeta}>
                    <label htmlFor="tarjeta">Tarjeta</label>
                    <input
                      onChange={handleSelection}
                      type="radio"
                      name="pago"
                      id="tarjeta"
                      value={"tarjeta"}
                    />
                  </div>
                  <div className={styles.divEfectivo}>
                    <label htmlFor="efectivo">Efectivo</label>
                    <input
                      onChange={handleSelection}
                      type="radio"
                      name="pago"
                      id="efectivo"
                      value={"efectivo"}
                      placeholder="Efectivo"
                    />
                  </div>
                </div>
                {select === "tarjeta" ? (
                  <div className={styles.divValidarTarjeta}>
                    <form className={styles.formValidarTarjeta}>
                      <div className={styles.divParesTarjeta}>
                        <input
                          placeholder="Número de tarjeta"
                          type="number"
                          id="numeroTarjeta"
                        />
                        <input
                          placeholder="Nombre del titular"
                          type="text"
                          id="nombreTitular"
                        />
                      </div>
                      <div className={styles.divParesTarjeta}>
                        <div className={styles.divFechaVencimiento}>
                          <label htmlFor="">Fecha de vencimiento</label>
                          <input
                            className={styles.inputFechaVencimiento}
                            placeholder="Fecha de vencimiento"
                            type="date"
                            id="fechaVencimiento"
                          />
                        </div>
                        <input
                          className={styles.inputCodigoSeguridad}
                          placeholder="Código de seguridad"
                          type="number"
                          id="codigoSeguridad"
                        />
                      </div>
                      <button>Validar tarjeta</button>
                    </form>
                  </div>
                ) : (
                  <></>
                )}
                <div className={styles.divLineasVenta}>
                  {lineasVenta.map((lineaVenta) => {
                    return (
                      <div className={styles.divLineaVenta} key={lineaVenta.id}>
                        <select className={styles.selectLineasVenta}>
                          <option> {lineaVenta.descripcionArticulo}</option>
                          <option disabled>{lineaVenta.marca}</option>

                          <option disabled>
                            Precio {lineaVenta.precioVenta}
                          </option>
                          <option disabled>
                            Cantidad: {lineaVenta.cantidad}
                          </option>
                          <option disabled>Color: {lineaVenta.color}</option>
                          <option disabled>Talle: {lineaVenta.talle}</option>
                        </select>
                        <button>
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <div className={styles.divFinalizarVenta}>
                  <h3>Total: {window.localStorage.getItem("total")}</h3>
                  <button>Realizar venta</button>
                  <button>Cancelar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Pago;
