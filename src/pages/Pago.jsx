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
  const [paginaCliente, setPaginaCliente] = useState(false);
  const [paginaPago, setPaginaPago] = useState(false); // [false, true
  const [registro, setRegistro] = useState(false);
  const [select, setSelect] = useState("");
  const [lineasVenta, setLineasVenta] = useState([]);

  useEffect(() => {
    setCliente(null);
    const lineasVenta = JSON.parse(localStorage.getItem("arrayStocks"));
    if (lineasVenta) {
      setLineasVenta(lineasVenta);
    }
    setPaginaCliente(true);
    setPaginaPago(false);
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

  const mostrarPaginaCliente = () => {
    setPaginaCliente(true);
    setPaginaPago(false);
  };

  const mostrarPaginaPago = () => {
    setPaginaCliente(false);
    setPaginaPago(true);
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
            <button
              className={styles.buttonHeader}
              onClick={mostrarPaginaCliente}
            >
              <i className="fa-regular fa-user"></i>
            </button>
            <button className={styles.buttonHeader} onClick={mostrarPaginaPago}>
              <i className="fa-solid fa-money-check-dollar"></i>
            </button>
          </header>
          <div className={styles.divRegistroYVenta}>
            {paginaCliente ? (
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
                      <h3>
                        <b>
                          {cliente.nombre} {cliente.apellido}
                        </b>
                      </h3>
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
                        <button className={styles.btnRegistrar}>
                          Registrar
                        </button>
                        <button
                          className={styles.btnCancelar}
                          onClick={cancelar}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  ) : (
                    <> </>
                  )}
                </form>
              </div>
            ) : (
              <></>
            )}
            {paginaPago ? (
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
                        <div
                          className={styles.divLineaVenta}
                          key={lineaVenta.id}
                        >
                          <select className={styles.selectLineasVenta}>
                            <option>{lineaVenta.descripcionArticulo}</option>
                            <option disabled>{lineaVenta.marca}</option>
                            <option disabled>
                              Precio {lineaVenta.precioVenta}
                            </option>
                            <option disabled>Color: {lineaVenta.color}</option>
                            <option disabled>Talle: {lineaVenta.talle}</option>
                          </select>
                          <h2 className={styles.h3Cantidad}>
                            Cantidad: {lineaVenta.cantidad}
                          </h2>
                          <h2 className={styles.h3Subtotal}>
                            Subtotal:{" "}
                            {lineaVenta.precioVenta * lineaVenta.cantidad}
                          </h2>

                          <button>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      );
                    })}
                    <h2 className={styles.h2Total}>
                      Total: {window.localStorage.getItem("total")}
                    </h2>
                  </div>
                  <div className={styles.divFinalizarVenta}>
                    <button>Realizar venta</button>
                    <button>Cancelar</button>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Pago;
