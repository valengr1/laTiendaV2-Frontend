import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "../styles/Ventas.module.css";

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

  const [linea, setLineaVenta] = useState({
    stock: {
      id: 0,
      articulo: {
        codigo: 0,
        descripcion: "",
        costo: 0.0,
        margenGanancia: 0.0,
        marca: {
          id: 0,
          descripcion: "",
        },
        categoria: {
          id: 0,
          descripcion: " ",
        },
        precio: 0.0,
      },
      color: {
        id: 0,
        descripcion: "",
      },
      talle: {
        id: 0,
        descripcion: "",
      },
      cantidad: 0,
    },
    cantidad: 0,
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:8080/articulo", { params: { codigo: codigo } })
      .then((response) => {
        console.log(response.data);
        setArticulo(response.data);
      })
      .catch(() => {
        alert("Artículo con código " + codigo + " no encontrado");
      });
    axios
      .get("http://localhost:8080/stock", { params: { codigo: codigo } })
      .then((response) => {
        console.log(response.data);
        setStock(response.data);
      });
  };

  const handleClick = (item) => {
    const lineaVenta = {
      stock: item,
      cantidad: 1,
    };
    setLineaVenta(lineaVenta);
    axios.post("http://localhost:8080/agregarLineaVenta", linea).then((res) => {
      alert(res.data);
    });
  };

  const handleNavigateToCarrito = () => {
    navigate("/carrito");
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
          <div
            className={style.carritoCompra}
            onClick={handleNavigateToCarrito}
          >
            <i className="fa-solid fa-cart-shopping" />
          </div>
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
              <table>
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
                            handleClick(item);
                          }}
                        >
                          <i className="fa-solid fa-cart-shopping" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay stock</p>
            )}
          </div>
        ) : (
          <p>Artículo inexistente</p>
        )}
      </div>
    </main>
  );
}

export default Ventas;
