import axios from "axios";
import { useEffect, useState } from "react";
//import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import style from "../styles/Ventas.module.css";
import { useNavigate } from "react-router-dom";
function Ventas() {
  useEffect(() => {
    setArticulo(null);
    setStock([]);
  }, []);
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState(0);
  const [articulo, setArticulo] = useState({
    codigo: 0,
    descripcion: "",
    marca: "",
    categoria: "",
    precio: 0.0,
    tipoTalle: "",
  });
  const [stock, setStock] = useState([
    {
      id: 0,
      talle: "",
      color: "",
      descripcionArticulo: "",
      marca: "",
      cantidadDisponible: 0,
      precioVenta: 0.0,
      cantidad: 0,
      subtotal: 0.0,
    },
  ]);
  const [arrayStocks, setArrayStocks] = useState([]);
  const [total, setTotal] = useState(0);

  const agregarArticulo = (item) => {
    if (arrayStocks.includes(item)) {
      toast.error("El artículo ya está en el carrito", {
        duration: 2000,
        position: "bottom-right",
        id: "errorAgregarArticulo",
      });
      return;
    } else if (item.talle === "" || item.color === "") {
      toast.error("No se puede agregar un artículo vacío", {
        duration: 2000,
        position: "bottom-right",
        id: "errorAgregarArticulo",
      });
      return;
    } else {
      toast.success("Artículo agregado al carrito", {
        duration: 2000,
        position: "bottom-right",
        id: "agregarArticulo",
      });
      item.cantidad = 1;
      item.subtotal = item.precioVenta * 1;
      setArrayStocks([...arrayStocks, item]);
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
  };

  const handleCantidadChange = (e, item) => {
    //let cantidad = e.target.value;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:8080/articulo", { params: { codigo: codigo } })
      .then((response) => {
        if (response.data === "") {
          toast.error("Artículo no encontrado", {
            duration: 2000,
            position: "bottom-right",
            id: "errorArticulo",
          });
          setArticulo(response.data);
        } else {
          toast.success("Artículo encontrado", {
            duration: 2000,
            position: "bottom-right",
            id: "articuloEncontrado",
          });
          setArticulo(response.data);
        }
      });
    axios
      .get("http://localhost:8080/stock", { params: { codigo: codigo } })
      .then((response) => {
        setStock(response.data);
        if (response.data.length === 0) {
          toast.error("No hay stock disponible", {
            duration: 2000,
            position: "bottom-right",
            id: "errorStock",
          });
        } else {
          setStock(response.data);
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
      navigate("/pago", { state: { arrayStocks: arrayStocks, total: total } });
    }
  };

  return (
    <main className={style.main}>
      <div className={style.divPrincipal}>
        <Toaster />
        <div className={style.divHeader}>
          <button
            className={style.btnCancelar}
            onClick={() => {
              navigate("/inicio");
            }}
          >
            <i className="fa-regular fa-circle-left"></i>
          </button>
          <h1 className={style.h1}>Nueva venta</h1>
          <h3 className={style.cantidadCarrito}>{arrayStocks.length}</h3>
          <button onClick={goToPago} className={style.btnFinalizar}>
            <i className="fa-brands fa-shopify"></i>
          </button>
        </div>
        <div className={style.barraConsulta}>
          <form className={style.form} onSubmit={handleSubmit}>
            <input
              className={style.inputCodigo}
              placeholder="Código"
              type="number"
              required
              name="codigo"
              onChange={(e) => setCodigo(e.target.value)}
            />
            <button className={style.btnConsultarStock}>Buscar</button>
          </form>
        </div>
        <div className={style.divArticuloYTabla}>
          {articulo ? (
            <div className={style.divArticulo}>
              <h3 className={style.subtituloH3}>Datos del articulo</h3>
              <div className={style.divDatosArticulo}>
                <h4 className={style.datoArticuloH4}>
                  Codigo: {articulo.codigo}
                </h4>
                <h4 className={style.datoArticuloH4}>
                  Descripción: {articulo.descripcion}
                </h4>
                <h4 className={style.datoArticuloH4}>
                  Marca: {articulo.marca}
                </h4>
                <h4 className={style.datoArticuloH4}>
                  Categoria: {articulo.categoria}
                </h4>
                <h4 className={style.datoArticuloH4}>
                  Precio: ${articulo.precio}
                </h4>
                <h4 className={style.datoArticuloH4}>
                  Tipo de talle: {articulo.tipoTalle}
                </h4>
              </div>
            </div>
          ) : (
            <div className={style.divArticuloOuter}></div>
          )}

          {stock.length > 0 ? (
            <div className={style.divTable}>
              <h3 className={style.h3StockDelArticulo}>Stock del artículo</h3>
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

        {arrayStocks.length > 0 ? (
          <div className={style.divTableCarrito}>
            <h3 className={style.h3CarritoCompras}>Venta</h3>
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
                    <td>{item.subtotal}</td>
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
              <p className={style.pTotal}>Total: ${total}</p>
            ) : (
              <>
                <button className={style.btnTotal} onClick={getTotal}>
                  Total
                </button>
              </>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}

export default Ventas;
