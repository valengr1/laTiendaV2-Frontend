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

  const [condicionesTributarias, setCondicionesTributarias] = useState([]);
  const [paginaCliente, setPaginaCliente] = useState(false);
  const [paginaPago, setPaginaPago] = useState(false); // [false, true
  const [registro, setRegistro] = useState(false);
  const [select, setSelect] = useState("");
  const [lineasVenta, setLineasVenta] = useState([]);
  const [total, setTotal] = useState(0);

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

  const cancelar = () => {
    setRegistro(false);
  };
  const handleSelection = (e) => {
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
  };

  const validarTarjeta = (e) => {
    e.preventDefault();
    const numeroTarjeta = "4507990000004905"; //document.getElementById("numeroTarjeta").value;
    const nombreTitular = "John Doe"; //document.getElementById("nombreTitular").value;
    const fechaVencimiento = "24-08-20"; //document.getElementById("fechaVencimiento").value;
    const codigoSeguridad = "123"; //document.getElementById("codigoSeguridad").value;
    const dniTitular = "25123456"; //document.getElementById("dniTitular").value;
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
      toast.error("Venta cancelada", {
        duration: 2000,
        position: "bottom-right",
        id: "quitarArticulo",
      });
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
                          onClick={cancelar}
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
                      <form
                        onSubmit={validarTarjeta}
                        className={styles.formValidarTarjeta}
                      >
                        <div className={styles.divParesTarjeta}>
                          <input
                            //required
                            placeholder="Número de tarjeta"
                            type="number"
                            id="numeroTarjeta"
                          />
                          <input
                            //required
                            placeholder="DNI del titular"
                            type="text"
                            id="dniTitular"
                          />
                          <input
                            //required
                            placeholder="Nombre del titular"
                            type="text"
                            id="nombreTitular"
                          />
                        </div>

                        <div className={styles.divParesTarjeta}>
                          <div className={styles.divFechaVencimiento}>
                            <label htmlFor="">Fecha de vencimiento</label>
                            <input
                              //required
                              className={styles.inputFechaVencimiento}
                              placeholder="Fecha de vencimiento"
                              type="date"
                              id="fechaVencimiento"
                            />
                          </div>
                          <input
                            //required
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
                  <div className={styles.divTableCarritoInner}>
                    <h3>Venta</h3>
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
                          <b>Total: ${total}</b>
                        </p>
                      </div>
                    ) : (
                      <div className={styles.divTotal}>
                        <button className={styles.btnTotal} onClick={getTotal}>
                          Total
                        </button>
                      </div>
                    )}
                  </div>
                  <div className={styles.divFinalizarVenta}>
                    <button className={styles.btnRealizarVenta}>
                      Realizar venta
                    </button>
                    <button
                      onClick={cancelarVenta}
                      className={styles.btnCancelar}
                    >
                      Cancelar
                    </button>
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
