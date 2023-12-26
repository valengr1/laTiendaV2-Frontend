import axios from "axios";
import { useState } from "react";

function Ventas() {
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
  return (
    <main>
      <h1>Nueva venta</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="">Código</label>
          <input
            type="number"
            required
            name="codigo"
            onChange={(e) => setCodigo(e.target.value)}
          />
          <button>Consultar stock</button>
        </form>
        <div>
          <i className="fa-solid fa-cart-shopping" />
        </div>
      </div>
      {articulo ? (
        <div>
          <h3>Datos del articulo</h3>
          <h4>Codigo: {articulo.codigo}</h4>
          <h4>Descripción: {articulo.descripcion}</h4>
          <h4>Marca: {articulo.marca.descripcion}</h4>
          <h4>Categoria: {articulo.categoria.descripcion}</h4>
          <h4>Precio: {articulo.precio}</h4>
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
                      <button>
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
    </main>
  );
}

export default Ventas;
