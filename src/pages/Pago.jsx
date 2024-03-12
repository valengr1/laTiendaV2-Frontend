import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Pago.module.css";
import { validaDNI, validaTelefono } from "../helpers/validacionesCliente";
import {
  buscarClientePorDNI,
  getCondicionesTributarias,
  registrarCliente,
} from "../services/clienteServices";
import {
  notificacionNegativa,
  notificacionPositiva,
} from "../helpers/notificaciones";
import { modalConfirmacion } from "../helpers/modales";
import axios from "axios";

function Pago() {
  const totalPagar = window.localStorage.getItem("total");
  const location = useLocation();
  const legajoVendedor = location.pathname.split("/")[2];
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
    setPaginaPago(true);
    getCondicionesTributarias(setCondicionesTributarias);
    setTablaVenta(true);
    setSelect("tarjeta");
    setpagoAutorizado(false);
  }, []);
  const navigate = useNavigate();
  const [dni, setDni] = useState("");
  const [condicionesTributarias, setCondicionesTributarias] = useState([]);
  const [paginaCliente, setPaginaCliente] = useState(false);
  const [paginaPago, setPaginaPago] = useState(false);
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
  const [tipoComprobanteAEmitir, setTipoComprobanteAEmitir] = useState("");
  const [pagoAutorizado, setpagoAutorizado] = useState(false);

  const buscarCliente = (e) => {
    e.preventDefault();
    setTipoComprobanteAEmitir("");
    if (validaDNI(dni)) {
      buscarClientePorDNI(dni, setCliente, setRegistro, registro);
    } else {
      setCliente(null);
    }
  };

  const ocultarRegistroCliente = () => {
    setRegistro(false);
  };

  // const handleSelectionFormaPago = (e) => {
  //   setSelect(e.target.value);
  // };

  const cancelarVenta = () => {
    const datos = {
      titulo: "Volver a nueva venta",
      texto: "Se perderán los datos de la venta actual",
      textoBotonConfirmacion: "Volver",
      textoBotonCancelar: "Cancelar",
    };

    const accion = () => {
      setTimeout(() => {
        window.localStorage.removeItem("arrayStocks");
        window.localStorage.removeItem("total");
        navigate("/ventas/" + legajoVendedor);
      }, 200);
    };
    modalConfirmacion(datos, accion);
  };

  const mostrarPaginaCliente = () => {
    setPaginaCliente(true);
  };

  const validarTarjeta = (e) => {
    e.preventDefault();
    if (!cliente || !tipoComprobanteAEmitir) {
      notificacionNegativa("Seleccione un cliente", "cliente no seleccionado");
      return;
    }
    const numeroTarjeta = document.getElementById("inputNumeroTarjeta").value; // "4507990000004905"; //
    const nombreTitular = document.getElementById("inputNombreTitular").value; //"John Doe";
    const fechaVencimiento = document.getElementById(
      "inputFechaVencimiento"
    ).value; // "08/20"; //
    const codigoSeguridad = document.getElementById(
      "inputCodigoSeguridad"
    ).value; // "123"; //
    const dniTitular = document.getElementById("inputDniTitular").value; // "25123456"; //
    const tarjeta = {
      numeroTarjeta,
      dniTitular,
      nombreTitular,
      fechaVencimiento,
      codigoSeguridad,
    };

    if (
      tarjeta.fechaVencimiento.match(/^(((0)[0-9])|((1)[0-2]))(\/)\d{2}$/) &&
      tarjeta.numeroTarjeta.match(/^\d{16}$/) &&
      tarjeta.codigoSeguridad.match(/^\d{3}$/) &&
      tarjeta.dniTitular.match(/^\d{8}$/) &&
      tarjeta.nombreTitular.match(/^[a-zA-Z\s]+$/)
    ) {
      let fecha = tarjeta.fechaVencimiento;
      let partes = fecha.split("/");
      let anio = partes[1];
      let mes = partes[0];

      const tarjetaPagar = {
        numeroTarjeta: tarjeta.numeroTarjeta,
        mesVencimiento: mes,
        anioVencimiento: anio,
        codigoSeguridad: tarjeta.codigoSeguridad,
        nombreTitular: tarjeta.nombreTitular,
        dniTitular: tarjeta.dniTitular,
      };

      const datos = {
        titulo: "Realizar pago",
        texto: "Estás seguro que deseas realizar el pago de $" + totalPagar,
        textoBotonConfirmacion: "Pagar",
        textoBotonCancelar: "Cancelar",
      };

      const accion = () => {
        axios
          .get(
            "http://localhost:8080/api/comprobantes/" +
              cliente.condicionTributaria.id
          )
          .then((res) => {
            console.log(res.data);
            setTipoComprobanteAEmitir(res.data);
          });
        axios
          .post(
            "http://localhost:8080/api/autorizacionesPagoTarjeta/" + totalPagar,
            tarjetaPagar
          )
          .then((res) => {
            console.log(res.data);
            if (res.data === "Pago aprobado") {
              notificacionPositiva("Pago aprobado", "Pago aprobado");
              setpagoAutorizado(true);
              setTimeout(() => {
                setSelect("efectivo");
              }, 2000);
            } else {
              notificacionNegativa(
                "Ingrese datos de tarjeta válidos",
                "Datos inválidos"
              );
            }
          })
          .catch((error) => {
            console.log(error);
            notificacionNegativa(
              "Error al realizar el pago, intente nuevamente.",
              "error al pagar"
            );
          });
      };
      modalConfirmacion(datos, accion);
    } else {
      notificacionNegativa(
        "Ingrese datos de tarjeta válidos",
        "Datos inválidos"
      );
    }
  };

  const registroCliente = (e) => {
    e.preventDefault();
    if (
      validaDNI(clienteRegistro.dni) &&
      validaTelefono(clienteRegistro.telefono)
    ) {
      registrarCliente(clienteRegistro, setRegistro);
    }
  };

  const getTotal = () => {
    let total = 0;
    lineasVenta.forEach((item) => {
      total += item.subtotal;
    });
    setTotal(total);
  };

  const seleccionarCliente = () => {
    notificacionPositiva("Cliente seleccionado", "cliente seleccionado");
    axios
      .get(
        "http://localhost:8080/api/comprobantes/" +
          cliente.condicionTributaria.id
      )
      .then((res) => {
        console.log(res.data);
        setTipoComprobanteAEmitir(res.data);
      });
    setPaginaCliente(false);
  };

  const finalizarVenta = (e) => {
    e.preventDefault();
    if (tipoComprobanteAEmitir && cliente) {
      if (pagoAutorizado) {
        let stocksYCantidades = [];
        lineasVenta.forEach((element) => {
          let stockYCantidad = {
            stockid: element.id,
            cantidadRequerida: Number(element.cantidad),
          };
          stocksYCantidades.push(stockYCantidad);
        });
        const datos = {
          titulo: "Registrar venta",
          texto: "Se registrará la venta realizada",
          textoBotonConfirmacion: "Registrar",
          textoBotonCancelar: "Cancelar",
        };
        const accion = () => {
          axios
            .post(
              "http://localhost:8080/api/ventas/" +
                legajoVendedor +
                "/" +
                cliente.dni,
              stocksYCantidades
            )
            .then((res) => {
              console.log(res.data);
              if (res.data === "Venta registrada con éxito") {
                notificacionPositiva(res.data, "positivo");
                setTimeout(() => {
                  window.localStorage.removeItem("arrayStocks");
                  window.localStorage.removeItem("total");
                  navigate("/ventas/" + legajoVendedor);
                }, 200);
              } else {
                notificacionNegativa(res.data, "negativo");
              }
            });
        };
        modalConfirmacion(datos, accion);
      } else {
        notificacionNegativa("Autorice el pago", "pago no autorizado");
      }
    } else {
      notificacionNegativa("Seleccione un cliente", "cliente no seleccionado");
    }
  };

  const handleQuitarArticulo = (id) => {
    let lineasVentaAux = lineasVenta.filter((item) => item.id !== id);
    setLineasVenta(lineasVentaAux);
    setTotal(0);
    toast.error("Artículo eliminado del carrito", {
      duration: 2000,
      position: "bottom-right",
      id: "quitarArticulo",
    });
    // if (lineasVenta.length === 0) {
    //   setPaginaArticulo(true);
    //   // setArticulo(null);
    //   // setStock([]);
    // }
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
          </header>
          <div className={styles.divRegistroYVenta}>
            {paginaCliente ? (
              <div className={styles.divClienteYRegistro}>
                <form className={styles.formBuscarCliente}>
                  <h3 className={styles.H1Cliente}>Cliente</h3>
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
                    <button
                      onClick={seleccionarCliente}
                      className={styles.btnSeleccionarCliente}
                    >
                      Seleccionar
                    </button>
                  </section>
                ) : (
                  <></>
                )}
                {registro ? (
                  <div className={styles.divRegistroCliente}>
                    <form onSubmit={registroCliente} action="">
                      <h3 className={styles.h3AgregarCliente}>Agregar</h3>
                      <div className={styles.divPares}>
                        <div className={styles.divInputs}>
                          <label className={styles.labelDNI} htmlFor="inputDNI">
                            DNI
                          </label>
                          <input
                            required
                            type="number"
                            name="dni"
                            id="inputDNI"
                            onChange={(e) => {
                              setClienteRegistro({
                                ...clienteRegistro,
                                dni: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className={styles.divInputs}>
                          <label
                            className={styles.labelDireccion}
                            htmlFor="inputDireccion"
                          >
                            Dirección
                          </label>
                          <input
                            required
                            type="text"
                            name="direccion"
                            id="inputDireccion"
                            onChange={(e) => {
                              setClienteRegistro({
                                ...clienteRegistro,
                                direccion: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className={styles.divPares}>
                        <div className={styles.divInputs}>
                          <label
                            className={styles.labelNombre}
                            htmlFor="inputNombre"
                          >
                            Nombre
                          </label>
                          <input
                            required
                            type="text"
                            name="nombre"
                            id="inputNombre"
                            onChange={(e) => {
                              setClienteRegistro({
                                ...clienteRegistro,
                                nombre: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className={styles.divInputs}>
                          <label
                            className={styles.labelApellido}
                            htmlFor="inputApellido"
                          >
                            Apellido
                          </label>
                          <input
                            required
                            type="text"
                            name="apellido"
                            id="inputApellido"
                            onChange={(e) => {
                              setClienteRegistro({
                                ...clienteRegistro,
                                apellido: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className={styles.divPares}>
                        <div className={styles.divInputs}>
                          <label
                            className={styles.labelTelefono}
                            htmlFor="inputTelefono"
                          >
                            Teléfono
                          </label>
                          <input
                            required
                            type="number"
                            name="telefono"
                            id="inputTelefono"
                            onChange={(e) => {
                              setClienteRegistro({
                                ...clienteRegistro,
                                telefono: e.target.value,
                              });
                            }}
                          />
                        </div>
                        <div className={styles.divInputs}>
                          <label
                            className={styles.labelCondicionTributaria}
                            htmlFor="inputCondicionTributaria"
                          >
                            Condición tributaria
                          </label>
                          <select
                            required
                            className={styles.divCondicionTributaria}
                            name="condicion_tributaria_id"
                            id="inputCondicionTributaria"
                            onChange={(e) => {
                              setClienteRegistro({
                                ...clienteRegistro,
                                condicionTributaria: {
                                  id: e.target.value,
                                  descripcion:
                                    e.target.options[e.target.selectedIndex]
                                      .text,
                                },
                              });
                            }}
                          >
                            <option value="">Seleccione</option>
                            {condicionesTributarias.map(
                              (condicionTributaria) => {
                                return (
                                  <option
                                    key={condicionTributaria.id}
                                    value={condicionTributaria.id}
                                  >
                                    {condicionTributaria.descripcion}
                                  </option>
                                );
                              }
                            )}
                          </select>
                        </div>
                      </div>
                      <div className={styles.divBotonera}>
                        <button className={styles.btnRegistrar}>
                          Confirmar
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
                <div className={styles.divFormaPagoInner}>
                  <h3 className={styles.h3Pago}>Método de pago</h3>
                  <div className={styles.divSelección}>
                    <div
                      onClick={() => {
                        setpagoAutorizado(false);
                        setSelect("tarjeta");
                        document.getElementById(
                          "divTarjeta"
                        ).style.backgroundColor = "#fff";
                        document.getElementById("divTarjeta").style.color =
                          "#000";
                        document.getElementById(
                          "divTarjeta"
                        ).style.fontWeight = 600;
                        document.getElementById(
                          "divEfectivo"
                        ).style.background = "transparent";
                        document.getElementById("divEfectivo").style.color =
                          "#fff";
                        document.getElementById(
                          "divEfectivo"
                        ).style.fontWeight = 100;
                      }}
                      className={styles.divTarjeta}
                      id="divTarjeta"
                    >
                      <label className={styles.iconoLabel} htmlFor="tarjeta">
                        <i className="fa-regular fa-credit-card"></i>
                        Tarjeta
                      </label>

                      {/* <input
                        onChange={handleSelectionFormaPago}
                        type="radio"
                        name="pago"
                        id="tarjeta"
                        value={"tarjeta"}
                        
                      /> */}
                    </div>
                    <div
                      onClick={() => {
                        setpagoAutorizado(true);
                        setSelect("efectivo");
                        document.getElementById(
                          "divEfectivo"
                        ).style.backgroundColor = "#fff";
                        document.getElementById("divEfectivo").style.color =
                          "#000";
                        document.getElementById(
                          "divEfectivo"
                        ).style.fontWeight = 600;
                        document.getElementById("divTarjeta").style.background =
                          "transparent";
                        document.getElementById("divTarjeta").style.color =
                          "#fff";
                        document.getElementById(
                          "divTarjeta"
                        ).style.fontWeight = 100;
                      }}
                      className={styles.divEfectivo}
                      id="divEfectivo"
                    >
                      <label className={styles.iconoLabel} htmlFor="efectivo">
                        <i className="fa-regular fa-money-bill-1"></i>
                        Efectivo
                      </label>
                      {/* <input
                        onChange={handleSelectionFormaPago}
                        type="radio"
                        name="pago"
                        id="efectivo"
                        value={"efectivo"}
                        
                        placeholder="Efectivo"
                      /> */}
                    </div>
                  </div>
                  {select === "tarjeta" ? (
                    <div className={styles.divValidarTarjeta}>
                      <form
                        onSubmit={validarTarjeta}
                        className={styles.formValidarTarjeta}
                      >
                        <div className={styles.divPares}>
                          <div className={styles.divInputs}>
                            <label
                              className={styles.labelNumeroTarjeta}
                              htmlFor="inputNumeroTarjeta"
                            >
                              Número de tarjeta
                            </label>
                            <input
                              required
                              type="number"
                              id="inputNumeroTarjeta"
                              pattern=".{8,}"
                              className={styles.inputNumeroTarjeta}
                              title="Eight or more characters"
                            />
                          </div>
                          <div className={styles.divInputs}>
                            <label
                              className={styles.labelDniTitular}
                              htmlFor="dniTitular"
                            >
                              Dni del titular
                            </label>
                            <input
                              className={styles.inputDniTitular}
                              required
                              type="text"
                              id="inputDniTitular"
                            />
                          </div>
                        </div>
                        <div className={styles.divPares}>
                          <div className={styles.divInputs}>
                            <label
                              className={styles.labelNombre}
                              htmlFor="inputNombreTitular"
                            >
                              Nombre del titular
                            </label>
                            <input
                              className={styles.inputNombreTitular}
                              required
                              type="text"
                              id="inputNombreTitular"
                            />
                          </div>
                          <div className={styles.divInputs}>
                            <label
                              className={styles.labelVencimiento}
                              htmlFor="inputFechaVencimiento"
                            >
                              Vencimiento de la tarjeta
                            </label>
                            <input
                              required
                              className={styles.inputFechaVencimiento}
                              placeholder="mm/aa"
                              type="text"
                              id="inputFechaVencimiento"
                            />
                          </div>
                        </div>
                        <div className={styles.divPares}>
                          <div className={styles.divInputs}>
                            <label
                              className={styles.labelCodigo}
                              htmlFor="inputCodigoSeguridad"
                            >
                              Codigo de seguridad
                            </label>
                            <input
                              required
                              className={styles.inputCodigoSeguridad}
                              type="number"
                              id="inputCodigoSeguridad"
                            />
                          </div>
                        </div>

                        <button>Autorizar pago</button>
                      </form>
                    </div>
                  ) : (
                    <></>
                  )}

                  {tablaVenta ? (
                    <div className={styles.divTableCarritoInner}>
                      <h4 className={styles.h4Venta}>Venta</h4>

                      <table className={styles.tableCarrito}>
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
                      {cliente ? (
                        <h3 className={styles.h3Comprobante}>
                          Cliente: {cliente.nombre} {cliente.apellido}
                        </h3>
                      ) : (
                        <></>
                      )}
                      {tipoComprobanteAEmitir ? (
                        <h3 className={styles.h3Comprobante}>
                          Comprobante: {tipoComprobanteAEmitir}
                        </h3>
                      ) : (
                        <> </>
                      )}

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
                        <button
                          onClick={finalizarVenta}
                          className={styles.btnRealizarVenta}
                        >
                          Finalizar venta
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
