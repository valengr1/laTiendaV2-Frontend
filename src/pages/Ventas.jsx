import axios from "axios";
import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import style from "../styles/Ventas.module.css";
import { useNavigate } from "react-router-dom";

function Ventas() {
  const navigate = useNavigate();
  const [codigo, setCodigo] = useState(0);
  const [articulo, setArticulo] = useState({
    categoria: {
      id: 0,
      descripcion: "",
    },
    codigo: 0,
    descripcion: "",
    marca: {
      id: 0,
      descripcion: "",
    },
    costo: 0,
    margenGanancia: 0,
    precio: 0,
  });
  const [stock, setStock] = useState([
    {
      articulo: {
        categoria: {
          id: 0,
          descripcion: "",
        },
        codigo: 0,
        descripcion: "",
        marca: {
          id: 0,
          descripcion: "",
        },
        costo: 0,
        margenGanancia: 0,
        precio: 0,
      },
      color: {
        id: 0,
        descripcion: "",
      },
      id: 0,
      talle: {
        id: 0,
        descripcion: "",
      },
      cantidad: 0,
    },
  ]);
  const [arrayStocks, setArrayStocks] = useState([]);

  const getSubtotal = () => {
    let subtotal = 0;
    arrayStocks.forEach((item) => {
      subtotal = subtotal + item.articulo.precio;
    });
    return subtotal;
  };

  let subtotal = getSubtotal();

  const handleQuitarArticulo = (id) => {
    setArrayStocks(arrayStocks.filter((item) => item.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:8080/articulo", { params: { codigo: codigo } })
      .then((response) => {
        setArticulo(response.data);
      })
      .catch(() => {
        alert("Artículo con código " + codigo + " no encontrado");
      });
    axios
      .get("http://localhost:8080/stock", { params: { codigo: codigo } })
      .then((response) => {
        setStock(response.data);
      });
  };
  return (
    <main className={style.main}>
      <div className={style.divPrincipal}>
        <h1 className={style.h1}>Nueva venta</h1>
        <div className={style.barraConsulta}>
          <form className={style.form} onSubmit={handleSubmit}>
            <label className={style.labelCodigo} htmlFor="">
              Código
            </label>
            <input
              className={style.inputCodigo}
              type="number"
              required
              name="codigo"
              onChange={(e) => setCodigo(e.target.value)}
            />
            <button className={style.btnConsultarStock}>Consultar stock</button>
          </form>
        </div>

        {articulo ? (
          <div className={style.divArticuloYTabla}>
            <div className={style.divArticulo}>
              <h3 className={style.subtituloH3}>Datos del articulo</h3>
              <h4 className={style.datoArticuloH4}>
                Codigo: {articulo.codigo}
              </h4>
              <h4 className={style.datoArticuloH4}>
                Descripción: {articulo.descripcion}
              </h4>
              <h4 className={style.datoArticuloH4}>
                Marca: {articulo.marca.descripcion}
              </h4>
              <h4 className={style.datoArticuloH4}>
                Categoria: {articulo.categoria.descripcion}
              </h4>
              <h4 className={style.datoArticuloH4}>
                Precio: {articulo.precio}
              </h4>
            </div>
            {stock.length > 0 ? (
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
                      <td>{item.talle.descripcion}</td>
                      <td>{item.color.descripcion}</td>
                      <td>{item.cantidad}</td>
                      <td>
                        <button
                          onClick={() => {
                            setArrayStocks([...arrayStocks, item]);
                          }}
                        >
                          <i className="fa-solid fa-cart-shopping"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className={style.divNoHayStock}>
                <p className={style.pNoHayStock}>No hay stock</p>
              </div>
            )}
          </div>
        ) : (
          <p className={style.pArticuloInexistente}>Artículo inexistente</p>
        )}
        {arrayStocks.length > 0 ? (
          <div className={style.divTableCarrito}>
            <table className={style.tableCarrito}>
              <thead>
                <tr>
                  <th>Descripcion</th>
                  <th>Marca</th>
                  <th>Talle</th>
                  <th>Color</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Quitar</th>
                </tr>
              </thead>
              <tbody>
                {arrayStocks.map((item) => (
                  <tr key={item.id}>
                    <td>{item.articulo.descripcion}</td>
                    <td>{item.articulo.marca.descripcion}</td>
                    <td>{item.talle.descripcion}</td>
                    <td>{item.color.descripcion}</td>
                    <td>1</td>
                    <td>{item.articulo.precio}</td>
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
            <p>Subtotal: {subtotal}</p>
          </div>
        ) : (
          <p>No hay articulos en el carrito</p>
        )}
        <div className={style.divBotones}>
          <button
            className={style.btnCancelar}
            onClick={() => {
              navigate("/inicio");
            }}
          >
            Cancelar
          </button>
          <button className={style.btnFinalizar}>Continuar venta</button>
        </div>
      </div>
    </main>
  );
}

export default Ventas;
