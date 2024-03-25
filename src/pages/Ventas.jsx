import axios from "axios";
import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import style from "../styles/Ventas.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { modalConfirmacion } from "../helpers/modales";
import {
  notificacionNegativa,
  notificacionPositiva,
} from "../helpers/notificaciones";
function Ventas() {
  const location = useLocation();
  const legajoVendedor = location.pathname.split("/")[2];
  useEffect(() => {
    setArticulo(null);
    setStock([]);
    setPaginaArticulo(true);
    const getEmpleado = (legajo) => {
      axios
        .get("http://localhost:8080/api/vendedores/" + legajo)
        .then((res) => {
          console.log(res.data);
          if (res.data === "") {
            toast.error("No se encontró el empleado");
          } else {
            setUsuario(res.data);
          }
        });
    };
    getEmpleado(legajoVendedor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState(0);
  const [articulo, setArticulo] = useState(null);
  const [stock, setStock] = useState([]);
  const [arrayStocks, setArrayStocks] = useState([]);
  const [total, setTotal] = useState(0);
  const [paginaArticulo, setPaginaArticulo] = useState(false);
  const [usuario, setUsuario] = useState(null);

  const agregarArticulo = (item) => {
    if (arrayStocks.find((element) => element.id === item.id)) {
      notificacionNegativa(
        "El artículo ya está seleccionado",
        "error al agregar"
      );
      return;
    } else if (item.talle === "" || item.color === "") {
      notificacionNegativa(
        "No se puede agregar un artículo vacío",
        "error al agregar"
      );
      return;
    } else {
      notificacionPositiva("Artículo seleccionado", "articulo agregado");
      item.cantidad = 1;
      item.subtotal = item.precioVenta * 1;
      if (arrayStocks.length === 0) {
        setArrayStocks([item]);
      } else {
        setArrayStocks([...arrayStocks, item]);
      }
    }
    setTotal(0);
  };

  const handleQuitarArticulo = (id) => {
    const datos = {
      titulo: "Quitar artículo",
      texto: "¿Está seguro que desea quitar el artículo de la venta?",
      textoBotonConfirmacion: "Quitar",
      textoBotonCancelar: "Cancelar",
    };

    const accion = () => {
      let arrayStocksAux = arrayStocks.filter((item) => item.id !== id);
      setArrayStocks(arrayStocksAux);
      setTotal(0);
      toast.error("Artículo eliminado de la venta", {
        duration: 2000,
        position: "bottom-right",
        id: "quitarArticulo",
      });
    };
    modalConfirmacion(datos, accion);

    // if (arrayStocksAux.length === 0) {
    //   setPaginaArticulo(true);
    //   // setArticulo(null);
    //   // setStock([]);
    // }
  };

  const handleCantidadChange = (e, item) => {
    //verificar que la cantidad no supere el stock disponible
    if (e.target.value > item.cantidadDisponible) {
      e.target.value = item.cantidadDisponible;
      getTotal();
    }
    //verificar que la cantidad ingresada no sea 0 o negativa o vacia
    if (e.target.value === "") {
      e.target.value = 1;
    }
    item.cantidad = e.target.value;
    let subtotal = item.cantidad * item.precioVenta;
    item.subtotal = subtotal;
    //reload html table
    getTotal();
    setArrayStocks([...arrayStocks]);
  };

  const getTotal = () => {
    let total = 0;
    arrayStocks.forEach((item) => {
      total += item.subtotal;
    });
    setTotal(total);
  };

  const buscarArticulo = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:8080/api/articulos/" + codigo)
      .then((response) => {
        console.log(response);
        setArticulo(response.data);
        axios
          .get(
            "http://localhost:8080/api/stocks/" + codigo + "/" + legajoVendedor
          )
          .then((res) => {
            if (res.data.length === 0) {
              notificacionNegativa("No hay stock disponible", "sin stock");
              setArticulo(null);
              setStock([]);
            } else {
              setStock(res.data);
              setArticulo(response.data);
            }
          });
      })
      .catch((err) => {
        notificacionNegativa(err.response.data);
        setArticulo(null);
        setStock([]);
      });
  };

  const goToPago = () => {
    if (arrayStocks.length === 0) {
      toast.error("No hay artículos seleccionados", {
        duration: 2000,
        position: "bottom-right",
        id: "errorPago",
      });
      return;
    } else if (total === 0) {
      toast.error("Debe calcular el total", {
        duration: 2000,
        position: "bottom-right",
        id: "errorPago",
      });
    } else {
      //guardar arrayStocks en localStorage
      localStorage.setItem("arrayStocks", JSON.stringify(arrayStocks));
      //guardar total en localStorage
      localStorage.setItem("total", total);
      navigate("/pago/" + legajoVendedor, {
        state: { arrayStocks: arrayStocks, total: total },
      });
    }
  };

  const volverAInicio = (e) => {
    e.preventDefault();
    const datos = {
      titulo: "Volver a inicio",
      texto: "Se perderán los datos de la venta",
      textoBotonConfirmacion: "Volver a inicio",
      textoBotonCancelar: "Cancelar",
    };

    const accion = () => {
      setTimeout(() => {
        navigate("/inicio/" + legajoVendedor);
      }, 200);
    };

    modalConfirmacion(datos, accion);
  };

  return (
    <main className={style.main}>
      <div className={style.divPrincipal}>
        <Toaster />

        <div className={style.divHeader}>
          <button className={style.btnVolverAInicio} onClick={volverAInicio}>
            <i className="fa-regular fa-circle-left"></i>
          </button>
          <button onClick={goToPago} className={style.btnFinalizar}>
            <i className="fa-brands fa-shopify"></i>
          </button>
        </div>
        <div className={style.divVentaOuter}>
          {paginaArticulo ? (
            <div className={style.divPaginaArticulo}>
              {usuario ? (
                <div className={style.divTituloSuperior}>
                  <h1 className={style.h1}>Buscar artículos</h1>
                  <div className={style.divUsuario}>
                    <i className="fa-regular fa-user"></i>
                    <h5 className={style.h5Usuario}>
                      {usuario.nombre} {usuario.apellido}
                    </h5>
                  </div>
                </div>
              ) : (
                <></>
              )}
              <div className={style.divConsultaYStock}>
                <div className={style.barraConsulta}>
                  <form className={style.form} onSubmit={buscarArticulo}>
                    <div className={style.divInputArticulo}>
                      <label
                        className={style.labelCodigoArticulo}
                        htmlFor="codigoArticulo"
                      >
                        Artículo
                      </label>
                      <input
                        className={style.inputCodigo}
                        placeholder="Código"
                        type="number"
                        required
                        name="codigo"
                        onChange={(e) => setCodigo(e.target.value)}
                      />
                    </div>
                    <button className={style.btnConsultarStock}>Buscar</button>
                  </form>
                </div>
                <div className={style.divArticuloYTabla}>
                  {articulo ? (
                    <div className={style.divArticulo}>
                      <h3 className={style.subtituloH3}>Datos del artículo</h3>
                      <div className={style.divDatosArticulo}>
                        <h4 className={style.datoArticuloH4}>
                          Codigo:<b> {articulo.codigo}</b>
                        </h4>
                        <h4 className={style.datoArticuloH4}>
                          Descripción: <b> {articulo.descripcion}</b>
                        </h4>
                        <h4 className={style.datoArticuloH4}>
                          Marca:<b> {articulo.marca.descripcion}</b>
                        </h4>
                        <h4 className={style.datoArticuloH4}>
                          Categoria:<b> {articulo.categoria.descripcion}</b>
                        </h4>
                        <h4 className={style.datoArticuloH4}>
                          Precio:<b> ${articulo.precio}</b>
                        </h4>
                        <h4 className={style.datoArticuloH4}>
                          Tipo de talle:<b> {articulo.tipoTalle.descripcion}</b>
                        </h4>
                      </div>
                    </div>
                  ) : (
                    <> </>
                  )}

                  {stock.length > 0 ? (
                    <div className={style.divTable}>
                      <h3 className={style.h3StockDelArticulo}>
                        Stock del artículo
                      </h3>
                      <table className={style.table}>
                        <thead>
                          <tr>
                            <th>Talle</th>
                            <th>Color</th>
                            <th>Cantidad disponible</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stock.map((item) => (
                            <tr key={item.id}>
                              <td>{item.talle}</td>
                              <td>{item.color}</td>
                              <td>{item.cantidadDisponible}</td>
                              <td>
                                <button
                                  onClick={() => {
                                    agregarArticulo(item);
                                  }}
                                >
                                  <i className="fa-solid fa-cart-shopping"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className={style.divTableOuter}></div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          {arrayStocks.length > 0 ? (
            <div className={style.divTableCarrito}>
              <h3 className={style.h3CarritoCompras}>
                Artículos seleccionados: {arrayStocks.length}
              </h3>
              <div className={style.divTableCarritoInner}>
                <table className={style.tableCarrito}>
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
                    {arrayStocks.map((item) => (
                      <tr key={item.id}>
                        <td>{item.descripcionArticulo}</td>
                        <td>{item.marca}</td>
                        <td>{item.talle}</td>
                        <td>{item.color}</td>
                        <td>
                          <input
                            min="1"
                            max={item.cantidadDisponible}
                            className={style.inputCantidad}
                            name="cantidad"
                            type="number"
                            defaultValue={1}
                            onChange={(e) => {
                              handleCantidadChange(e, item);
                            }}
                          />
                        </td>
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
              </div>
              {total ? (
                <div className={style.divTotal}>
                  <p className={style.pTotal}>
                    <b>Total: ${total}</b>
                  </p>
                </div>
              ) : (
                <div className={style.divTotal}>
                  <button className={style.btnTotal} onClick={getTotal}>
                    Total
                  </button>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </main>
  );
}

export default Ventas;
