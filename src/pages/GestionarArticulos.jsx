import { useNavigate } from "react-router-dom";
import styles from "../styles/GestionarArticulo.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import {
  articuloEliminadoCorrectamente,
  notificacionArticuloInexistente,
  notificacionPositiva,
} from "../helpers/notificaciones";
import { modalConfirmacion } from "../helpers/modales";

function GestionarArticulos() {
  useEffect(() => {
    setArticuloResponse(null);
    setMostrarRegistroArticulo(false);

    const getMarcas = () => {
      axios.get("http://localhost:8080/getMarcas").then((res) => {
        setMarcas(res.data);
      });
    };

    getMarcas();

    const getCategorias = () => {
      axios.get("http://localhost:8080/getCategorias").then((res) => {
        setCategorias(res.data);
      });
    };

    getCategorias();

    const getTiposTalle = () => {
      axios.get("http://localhost:8080/getTiposTalle").then((res) => {
        setTiposTalle(res.data);
      });
    };

    getTiposTalle();
  }, []);
  const navigate = useNavigate();
  const [codigoArticulo, setCodigoArticulo] = useState(0);
  // const [articuloResponse, setArticuloResponse] = useState({
  //   codigo: 0,
  //   descripcion: "",
  //   marca: "",
  //   categoria: "",
  //   precio: 0,
  //   tipoTalle: "",
  // });
  const [articuloResponse, setArticuloResponse] = useState({
    codigo: 0,
    descripcion: "",
    costo: 0,
    margenGanancia: 0,
    marca: {
      id: 0,
      descripcion: "",
    },
    categoria: {
      id: 0,
      descripcion: "",
    },
    tipoTalle: {
      id: 0,
      descripcion: "",
    },
    precio: 0,
  });
  const [mostrarRegistroArticulo, setMostrarRegistroArticulo] = useState(false);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposTalle, setTiposTalle] = useState([]);
  const [articuloRegistro, setArticuloRegistro] = useState({
    codigo: 0,
    descripcion: "",
    costo: 0,
    margenGanancia: 0,
    marca: {
      id: 0,
      descripcion: "",
    },
    categoria: {
      id: 0,
      descripcion: "",
    },
    tipoTalle: {
      id: 0,
      descripcion: "",
    },
  });
  const [precio, setPrecio] = useState(0);
  const cancelarGestionCliente = () => {
    navigate("/inicio");
  };

  const buscarArticulo = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:8080/getArticuloByCodigo", {
        params: { codigo: codigoArticulo },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === "") {
          notificacionArticuloInexistente();
        }
        setArticuloResponse(res.data);
        calcularPrecio(res.data);
      });
    setMostrarRegistroArticulo(false);
  };

  const calcularPrecio = (articulo) => {
    // Neto Gravado = Costo + Costo * Margen de Ganancia
    // IVA = Neto Gravado * Porcentaje de IVA
    // Precio de Venta = Neto Gravado + IVA
    let netoGravado = articulo.costo + articulo.costo * articulo.margenGanancia;
    let iva = netoGravado * 0.21;
    let precio = netoGravado + iva;
    setPrecio(precio);
  };

  const eliminarArticulo = (e) => {
    //Revisar clave foranea de articulo en stock a la hora de eliminar
    e.preventDefault();
    axios
      .delete("http://localhost:8080/eliminarArticulo", {
        params: { codigo: articuloResponse.codigo },
      })
      .then(() => {
        const datos = {
          titulo: "Eliminar artículo",
          texto: "Estás seguro que deseas eliminar el artículo?",
          textoBotonConfirmacion: "Eliminar",
          textoBotonCancelar: "Cancelar",
        };

        const accion = () => {
          articuloEliminadoCorrectamente();
          setTimeout(() => {
            setArticuloResponse(null);
          }, 1000);
        };
        modalConfirmacion(datos, accion);
      });
  };

  const mostrarAñadirArticulo = (e) => {
    e.preventDefault();
    setMostrarRegistroArticulo(true);
    const inputBuscar = document.getElementById("codigoBuscar");
    inputBuscar.value = "";
    setArticuloResponse(null);
    setCodigoArticulo(null);
  };

  const ocultarRegistroArticulo = (e) => {
    e.preventDefault();
    setMostrarRegistroArticulo(false);
  };

  const registrarArticulo = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/agregarArticulo", articuloRegistro)
      .then((res) => {
        if (res.data === "Artículo agregado correctamente") {
          let texto = res.data;
          let id = "articuloAgregado";
          notificacionPositiva(texto, id);
        }
      });
  };

  return (
    <main className={styles.main}>
      <Toaster />
      <div className={styles.divPrincipal}>
        <div className={styles.divGestionArticulosOuter}>
          <header className={styles.header}>
            <button
              className={styles.buttonHeader}
              onClick={cancelarGestionCliente}
            >
              <i className="fa-regular fa-circle-left"></i>
            </button>
          </header>
          <div className={styles.divGestionArticulos}>
            <div className={styles.articuloYRegistro}>
              <h3 className={styles.H1Articulo}>Artículos</h3>
              <form
                onSubmit={buscarArticulo}
                className={styles.formBuscarArticulo}
              >
                <input
                  onChange={(e) => setCodigoArticulo(e.target.value)}
                  type="number"
                  placeholder="Código"
                  required
                  id="codigoBuscar"
                />
                <button className={styles.btnBuscarArticulo}>Buscar</button>
                <button
                  className={styles.btnAgregarArticulo}
                  onClick={mostrarAñadirArticulo}
                >
                  Añadir
                </button>
              </form>
              {articuloResponse ? (
                <section className={styles.divArticuloEncontrado}>
                  <h3>
                    Codigo: <b>{articuloResponse.codigo}</b>
                  </h3>
                  <h3>
                    Descripcion: <b> {articuloResponse.descripcion}</b>
                  </h3>
                  <h3>
                    Marca: <b>{articuloResponse.marca.descripcion}</b>
                  </h3>
                  <h3>
                    Categoria: <b>{articuloResponse.categoria.descripcion}</b>
                  </h3>
                  <h3>
                    Costo: <b>{articuloResponse.costo}</b>
                  </h3>
                  <h3>
                    Margen de ganancia: <b>{articuloResponse.margenGanancia}</b>
                  </h3>
                  <h3>
                    Precio: <b>{precio}</b>
                  </h3>
                  <h3>
                    Tipo de talle:{" "}
                    <b>{articuloResponse.tipoTalle.descripcion}</b>
                  </h3>
                  <button
                    //onClick={seleccionarCliente}
                    className={styles.btnModificar}
                  >
                    Modificar
                  </button>
                  <button
                    onClick={eliminarArticulo}
                    className={styles.btnEliminar}
                  >
                    Eliminar
                  </button>
                </section>
              ) : (
                <></>
              )}
              {mostrarRegistroArticulo ? (
                <div className={styles.divRegistroArticulo}>
                  <form action="">
                    <div className={styles.divPares}>
                      <input
                        required
                        placeholder="Codigo"
                        type="number"
                        name="codigo"
                        onChange={(e) => {
                          setArticuloRegistro({
                            ...articuloRegistro,
                            codigo: e.target.value,
                          });
                        }}
                      />
                      <input
                        required
                        placeholder="Descripcion"
                        type="text"
                        name="descripcion"
                        onChange={(e) => {
                          setArticuloRegistro({
                            ...articuloRegistro,
                            descripcion: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className={styles.divPares}>
                      <select
                        className={styles.selects}
                        name="marcas"
                        id="marcas"
                        required
                        onChange={(e) => {
                          setArticuloRegistro({
                            ...articuloRegistro,
                            marca: {
                              id: e.target.value,
                              descripcion:
                                e.target.options[e.target.selectedIndex].text,
                            },
                          });
                        }}
                      >
                        <option value="">Marca</option>
                        {marcas.map((marca) => (
                          <option key={marca.id} value={marca.id}>
                            {marca.descripcion}
                          </option>
                        ))}
                      </select>

                      <select
                        className={styles.selects}
                        name="categorias"
                        id="categorias"
                        required
                        onChange={(e) => {
                          setArticuloRegistro({
                            ...articuloRegistro,
                            categoria: {
                              id: e.target.value,
                              descripcion:
                                e.target.options[e.target.selectedIndex].text,
                            },
                          });
                        }}
                      >
                        <option value="">Categoría</option>
                        {categorias.map((categoria) => (
                          <option key={categoria.id} value={categoria.id}>
                            {categoria.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.divPares}>
                      <input
                        required
                        placeholder="Costo"
                        type="number"
                        name="costo"
                        onChange={(e) => {
                          setArticuloRegistro({
                            ...articuloRegistro,
                            costo: e.target.value,
                          });
                        }}
                      />
                      <input
                        required
                        placeholder="Margen de ganancia"
                        type="text"
                        name="margenGanancia"
                        onChange={(e) => {
                          setArticuloRegistro({
                            ...articuloRegistro,
                            margenGanancia: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className={styles.divPares}>
                      <select
                        className={styles.selects}
                        name="tiposTalle"
                        id="tiposTalle"
                        required
                        onChange={(e) => {
                          setArticuloRegistro({
                            ...articuloRegistro,
                            tipoTalle: {
                              id: e.target.value,
                              descripcion:
                                e.target.options[e.target.selectedIndex].text,
                            },
                          });
                        }}
                      >
                        <option value="">Tipo de talle</option>
                        {tiposTalle.map((tipoTalle) => (
                          <option key={tipoTalle.id} value={tipoTalle.id}>
                            {tipoTalle.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.divBotonera}>
                      <button
                        onClick={registrarArticulo}
                        className={styles.btnRegistrar}
                      >
                        Registrar
                      </button>
                      <button
                        className={styles.btnCancelar}
                        onClick={ocultarRegistroArticulo}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default GestionarArticulos;
