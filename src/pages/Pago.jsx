import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Pago.module.css";
import { validaDNI, validaTelefono } from "../helpers/validacionesCliente";
import {
  buscarClientePorDNI,
  getCondicionesTributarias,
  registrarCliente,
} from "../services/clienteServices";
import { solicitarTokenPago } from "../services/pagoServices";
import { notificacionDNIInvalido } from "../helpers/notificaciones";

function Pago() {
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
  const [condicionesTributarias, setCondicionesTributarias] = useState([]);
  const [paginaCliente, setPaginaCliente] = useState(false);
  const [paginaPago, setPaginaPago] = useState(false); // [false, true
  const [registro, setRegistro] = useState(false);
  const [select, setSelect] = useState("");
  const [lineasVenta, setLineasVenta] = useState([]);
  const [total, setTotal] = useState(0);
  const [tablaVenta, setTablaVenta] = useState(false);
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
  const [clienteRegistro, setClienteRegistro] = useState({
    dni: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    condicionTributaria: {
      descripcion: "",
      id: 0,
    },
  });

  useEffect(() => {
    setCliente(null);
    const lineasVenta = JSON.parse(localStorage.getItem("arrayStocks"));
    if (lineasVenta) {
      setLineasVenta(lineasVenta);
    }
    const total = localStorage.getItem("total");
    if (total) {
      setTotal(total);
    }
    setPaginaCliente(true);
    setPaginaPago(false);
    getCondicionesTributarias(setCondicionesTributarias);
    setTablaVenta(false);
    setSelect("tarjeta");
  }, []);

  const buscarCliente = (e) => {
    e.preventDefault();
    if (validaDNI(dni)) {
      buscarClientePorDNI(dni, setCliente, setRegistro);
    } else {
      notificacionDNIInvalido();
    }
  };

  const mostrarRegistroCliente = (e) => {
    e.preventDefault();
    setCliente(null);
    setRegistro(true);
  };

  const ocultarRegistroCliente = () => {
    setRegistro(false);
  };

  const handleSelectionFormaPago = (e) => {
    setSelect(e.target.value);
  };

  const cancelarVenta = () => {
    toast.error("Venta cancelada", {
      duration: 1500,
      position: "bottom-right",
      id: "cancelarVenta",
    });
    setTimeout(() => {
      window.localStorage.removeItem("arrayStocks");
      window.localStorage.removeItem("total");
      navigate("/ventas");
    }, 2000);
  };

  const mostrarPaginaCliente = () => {
    setPaginaCliente(true);
    setPaginaPago(false);
  };

  const mostrarPaginaPago = () => {
    setPaginaCliente(false);
    setPaginaPago(true);
    setTablaVenta(false);
    setSelect("tarjeta");
  };

  const validarTarjeta = (e) => {
    e.preventDefault();
    const numeroTarjeta = document.getElementById("numeroTarjeta").value; // "4507990000004905"; //
    const nombreTitular = document.getElementById("nombreTitular").value; //"John Doe";
    const fechaVencimiento = document.getElementById("fechaVencimiento").value; // "24-08-20"; //
    const codigoSeguridad = document.getElementById("codigoSeguridad").value; // "123"; //
    const dniTitular = document.getElementById("dniTitular").value; // "25123456"; //
    const tarjeta = {
      numeroTarjeta,
      dniTitular,
      nombreTitular,
      fechaVencimiento,
      codigoSeguridad,
    };
    solicitarTokenPago(tarjeta);
  };

  const registroCliente = (e) => {
    e.preventDefault();
    if (
      validaDNI(clienteRegistro.dni) &&
      validaTelefono(clienteRegistro.telefono)
    ) {
      registrarCliente(clienteRegistro, setCliente);
      setRegistro(false);
    }
  };

  const handleQuitarArticulo = (id) => {
    let arrayStocksAux = lineasVenta.filter((item) => item.id !== id);
    setLineasVenta(arrayStocksAux);
    toast.error("Artículo eliminado del carrito", {
      duration: 2000,
      position: "bottom-right",
      id: "quitarArticulo",
    });
    setTotal(0);
    if (arrayStocksAux.length === 0) {
      setTablaVenta(false);
      setTimeout(() => {
        cancelarVenta();
      }, 1000);
    }
  };

  const getTotal = () => {
    let total = 0;
    lineasVenta.forEach((item) => {
      total += item.subtotal;
    });
    setTotal(total);
  };

  const mostrarTablaVenta = () => {
    setTablaVenta(true);
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
            <button className={styles.buttonHeader} onClick={mostrarTablaVenta}>
              <i className="fa-solid fa-bag-shopping"></i>
            </button>
          </header>
          <div className={styles.divRegistroYVenta}>
            {paginaCliente ? (
              <div className={styles.divClienteYRegistro}>
                <h3 className={styles.H1Cliente}>Cliente</h3>
                <form className={styles.formBuscarCliente}>
                  <input
                    onChange={(e) => setDni(e.target.value)}
                    type="number"
                    placeholder="DNI"
                    required
                    id="dni"
                  />
                  <button
                    className={styles.btnBuscarCliente}
                    onClick={buscarCliente}
                  >
                    Buscar
                  </button>
                  <button
                    className={styles.btnRegistrarCliente}
                    onClick={mostrarRegistroCliente}
                  >
                    Añadir
                  </button>
                </form>
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
                  <div className={styles.divRegistroCliente}>
                    <form onSubmit={registroCliente} action="">
                      <div className={styles.divPares}>
                        <input
                          required
                          placeholder="DNI"
                          type="number"
                          name="dni"
                          onChange={(e) => {
                            setClienteRegistro({
                              ...clienteRegistro,
                              dni: e.target.value,
                            });
                          }}
                        />
                        <input
                          required
                          placeholder="Nombre"
                          type="text"
                          name="nombre"
                          onChange={(e) => {
                            setClienteRegistro({
                              ...clienteRegistro,
                              nombre: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className={styles.divPares}>
                        <input
                          required
                          placeholder="Apellido"
                          type="text"
                          name="apellido"
                          onChange={(e) => {
                            setClienteRegistro({
                              ...clienteRegistro,
                              apellido: e.target.value,
                            });
                          }}
                        />
                        <input
                          required
                          placeholder="Dirección"
                          type="text"
                          name="direccion"
                          onChange={(e) => {
                            setClienteRegistro({
                              ...clienteRegistro,
                              direccion: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className={styles.divPares}>
                        <input
                          required
                          placeholder="Teléfono"
                          type="number"
                          name="telefono"
                          onChange={(e) => {
                            setClienteRegistro({
                              ...clienteRegistro,
                              telefono: e.target.value,
                            });
                          }}
                        />
                        <select
                          required
                          className={styles.divCondicionTributaria}
                          name="condicion_tributaria_id"
                          id=""
                          onChange={(e) => {
                            setClienteRegistro({
                              ...clienteRegistro,
                              condicionTributaria: {
                                id: e.target.value,
                                descripcion:
                                  e.target.options[e.target.selectedIndex].text,
                              },
                            });
                          }}
                        >
                          <option value="">Condición tributaria</option>
                          {condicionesTributarias.map((condicionTributaria) => {
                            return (
                              <option
                                key={condicionTributaria.id}
                                value={condicionTributaria.id}
                              >
                                {condicionTributaria.descripcion}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className={styles.divBotonera}>
                        <button className={styles.btnRegistrar}>
                          Registrar
                        </button>
                        <button
                          className={styles.btnCancelar}
                          onClick={ocultarRegistroCliente}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <> </>
                )}
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
                      <label className={styles.iconoLabel} htmlFor="tarjeta">
                        <i className="fa-regular fa-credit-card"></i>
                      </label>

                      <input
                        onChange={handleSelectionFormaPago}
                        type="radio"
                        name="pago"
                        id="tarjeta"
                        value={"tarjeta"}
                      />
                    </div>
                    <div className={styles.divEfectivo}>
                      <label className={styles.iconoLabel} htmlFor="efectivo">
                        <i className="fa-regular fa-money-bill-1"></i>
                      </label>
                      <input
                        onChange={handleSelectionFormaPago}
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
                      <form
                        onSubmit={validarTarjeta}
                        className={styles.formValidarTarjeta}
                      >
                        <div className={styles.divParesTarjeta}>
                          <input
                            required
                            placeholder="Número de tarjeta"
                            type="number"
                            id="numeroTarjeta"
                          />
                          <input
                            required
                            placeholder="DNI del titular"
                            type="text"
                            id="dniTitular"
                          />
                          <input
                            required
                            placeholder="Nombre del titular"
                            type="text"
                            id="nombreTitular"
                          />
                        </div>

                        <div className={styles.divParesTarjeta}>
                          <div className={styles.divFechaVencimiento}>
                            <label htmlFor="">Fecha de vencimiento</label>
                            <input
                              required
                              className={styles.inputFechaVencimiento}
                              placeholder="Fecha de vencimiento"
                              type="date"
                              id="fechaVencimiento"
                            />
                          </div>
                          <input
                            required
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

                  {tablaVenta ? (
                    <div className={styles.divTableCarritoInner}>
                      <h4 className={styles.h4Venta}>Venta</h4>
                      <table className={styles.tableCarrito}>
                        <thead>
                          <tr>
                            <th>Descripcion</th>
                            <th>Marca</th>
                            <th>Talle</th>
                            <th>Color</th>
                            <th>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                            <th>Quitar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lineasVenta.map((item) => (
                            <tr key={item.id}>
                              <td>{item.descripcionArticulo}</td>
                              <td>{item.marca}</td>
                              <td>{item.talle}</td>
                              <td>{item.color}</td>
                              <td>{item.cantidad}</td>
                              <td>${item.precioVenta}</td>
                              <td>
                                <b>${item.subtotal}</b>
                              </td>
                              <td>
                                <button
                                  onClick={() => {
                                    handleQuitarArticulo(item.id);
                                  }}
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {total ? (
                        <div className={styles.divTotal}>
                          <p className={styles.pTotal}>
                            Total:<b> ${total}</b>
                          </p>
                        </div>
                      ) : (
                        <div className={styles.divTotal}>
                          <button
                            className={styles.btnTotal}
                            onClick={getTotal}
                          >
                            Total
                          </button>
                        </div>
                      )}
                      <div className={styles.divFinalizarVenta}>
                        <button className={styles.btnRealizarVenta}>
                          Registrar venta
                        </button>
                        <button
                          onClick={cancelarVenta}
                          className={styles.btnCancelar}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
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
