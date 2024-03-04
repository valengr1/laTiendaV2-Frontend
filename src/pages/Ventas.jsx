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
  useEffect(() => {
    setArticulo(null);
    setStock([]);
    setPaginaArticulo(true);
    setPaginaCarrito(false);
  }, []);
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState(0);
  const [articulo, setArticulo] = useState(null);
  const [stock, setStock] = useState([]);
  const [arrayStocks, setArrayStocks] = useState([]);
  const [total, setTotal] = useState(0);
  const [paginaArticulo, setPaginaArticulo] = useState(false);
  const [paginaCarrito, setPaginaCarrito] = useState(false);
  // const legajoVendedor = JSON.parse(localStorage.getItem("legajoVendedor"));
  const location = useLocation();
  const legajoVendedor = location.pathname.split("/")[2];

  const agregarArticulo = (item) => {
    if (arrayStocks.find((element) => element.id === item.id)) {
      notificacionNegativa(
        "El artículo ya está en el carrito",
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
      notificacionPositiva("Artículo agregado al carrito", "articulo agregado");
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
    let arrayStocksAux = arrayStocks.filter((item) => item.id !== id);
    setArrayStocks(arrayStocksAux);
    setTotal(0);
    toast.error("Artículo eliminado del carrito", {
      duration: 2000,
      position: "bottom-right",
      id: "quitarArticulo",
    });
    if (arrayStocksAux.length === 0) {
      setPaginaCarrito(false);
      setPaginaArticulo(true);
      setArticulo(null);
      setStock([]);
    }
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
      .get(
        "http://localhost:8080/api/articulo/buscarArticuloByCodigoAndEstado",
        {
          params: { codigo: codigo },
        }
      )
      .then((response) => {
        console.log(response.data);
        if (response.data === "") {
          notificacionNegativa(
            "Artículo inexistente",
            "Artículo no encontrado"
          );
          setArticulo(response.data);
          setStock([]);
        } else {
          toast.success("Artículo encontrado", {
            duration: 2000,
            position: "bottom-right",
            id: "articuloEncontrado",
          });
          setArticulo(response.data);
          axios
            .get("http://localhost:8080/api/stock/buscarBySucursal", {
              params: {
                codigoArticulo: codigo,
                legajoVendedor: legajoVendedor,
              },
            })
            .then((response) => {
              if (response.data.length === 0) {
                notificacionNegativa("No hay stock disponible", "sin stock");
                setStock([]);
              } else {
                setStock(response.data);
              }
            });
        }
      });
  };

  const goToPago = () => {
    if (arrayStocks.length === 0) {
      toast.error("No hay artículos en el carrito", {
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

  const mostrarCarrito = () => {
    if (arrayStocks.length === 0) {
      toast.error("No hay artículos en el carrito", {
        duration: 2000,
        position: "bottom-right",
        id: "errorCarrito",
      });
      return;
    }
    setPaginaCarrito(true);
    setPaginaArticulo(false);
  };

  const mostrarPaginaArticulo = () => {
    setPaginaArticulo(true);
    setPaginaCarrito(false);
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
        <div className={style.divVentaOuter}>
          <div className={style.divHeader}>
            <button className={style.btnVolverAInicio} onClick={volverAInicio}>
              <i className="fa-regular fa-circle-left"></i>
            </button>
            <button
              className={style.btnBuscarArticulo}
              onClick={mostrarPaginaArticulo}
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <div className={style.divICarritoCompra}>
              <button
                onClick={mostrarCarrito}
                className={style.btnCarritoCompra}
              >
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
              <h3 className={style.cantidadCarrito}>{arrayStocks.length}</h3>
            </div>
            <button onClick={goToPago} className={style.btnFinalizar}>
              <i className="fa-brands fa-shopify"></i>
            </button>
          </div>
          {paginaArticulo ? (
            <div className={style.divPaginaArticulo}>
              <div className={style.divConsultaYStock}>
                <h1 className={style.h1}>Nueva venta</h1>
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
                      <h3 className={style.subtituloH3}>Datos del articulo</h3>
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

          {paginaCarrito ? (
            <div className={style.divTableCarrito}>
              <h3 className={style.h3CarritoCompras}>Venta</h3>
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
