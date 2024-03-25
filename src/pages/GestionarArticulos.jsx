import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/GestionarArticulo.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import {
  notificacionNegativa,
  notificacionPositiva,
} from "../helpers/notificaciones";
import { modalConfirmacion } from "../helpers/modales";

function GestionarArticulos() {
  const location = useLocation();
  const legajo = location.pathname.split("/")[2];
  useEffect(() => {
    setMostrarRegistroArticulo(false);
    setMostrarModificarArticulo(false);

    const getMarcas = () => {
      axios.get("http://localhost:8080/api/marcas").then((res) => {
        setMarcas(res.data);
      });
    };

    getMarcas();

    const getCategorias = () => {
      axios.get("http://localhost:8080/api/categorias").then((res) => {
        setCategorias(res.data);
      });
    };

    getCategorias();

    const getTiposTalle = () => {
      axios.get("http://localhost:8080/api/tiposTalle").then((res) => {
        setTiposTalle(res.data);
      });
    };

    getTiposTalle();
  }, []);
  const navigate = useNavigate();
  const [codigoArticulo, setCodigoArticulo] = useState(0);
  const [articuloResponse, setArticuloResponse] = useState(null);
  const [mostrarRegistroArticulo, setMostrarRegistroArticulo] = useState(false);
  const [mostrarModificarArticulo, setMostrarModificarArticulo] =
    useState(false);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposTalle, setTiposTalle] = useState([]);
  const [articuloRegistro, setArticuloRegistro] = useState(null);
  const [articuloModificacion, setArticuloModificacion] = useState(null);
  const [precio, setPrecio] = useState(0);

  const cancelarGestionCliente = () => {
    navigate("/inicio/" + legajo);
  };

  const buscarArticulo = (e) => {
    e.preventDefault();

    axios
      .get("http://localhost:8080/api/articulos/" + codigoArticulo)
      .then((res) => {
        const status = res.status;
        if (status === 200) {
          setArticuloResponse(res.data);
          calcularPrecio(res.data);
        }
      })
      .catch((err) => {
        setArticuloResponse(null);
        const status = err.response.status;
        if (status === 404) {
          notificacionNegativa("No se encontró el artículo", "not found");
        }
      });
    setMostrarRegistroArticulo(false);
    setMostrarModificarArticulo(false);
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
    e.preventDefault();
    setMostrarModificarArticulo(false);
    const datos = {
      titulo: "Eliminar artículo",
      texto: "Estás seguro que deseas eliminar el artículo?",
      textoBotonConfirmacion: "Eliminar",
      textoBotonCancelar: "Cancelar",
    };

    const accion = () => {
      axios
        .delete(
          "http://localhost:8080/api/articulos/" + articuloResponse.codigo
        )
        .then((res) => {
          const status = res.status;
          if (status === 200) {
            notificacionPositiva(
              "Artículo eliminado correctamente",
              "articulo eliminado"
            );
            setTimeout(() => {
              setArticuloResponse(null);
            }, 1000);
          }
        })
        .catch(() => {
          notificacionNegativa("No se pudo eliminar el artículo", "error");
        });
    };
    modalConfirmacion(datos, accion);
  };

  const mostrarAñadirArticulo = (e) => {
    e.preventDefault();
    setMostrarRegistroArticulo(true);
    const inputBuscar = document.getElementById("codigoBuscar");
    inputBuscar.value = "";
    setArticuloResponse(null);
    setCodigoArticulo(null);
    setMostrarModificarArticulo(false);
  };

  const ocultarRegistroArticulo = (e) => {
    e.preventDefault();
    setMostrarRegistroArticulo(false);
  };

  const registrarArticulo = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/api/articulos", articuloRegistro)
      .then((res) => {
        console.log(res.data);
        if (res.data === "Artículo agregado correctamente") {
          let texto = res.data;
          let id = "articuloAgregado";
          notificacionPositiva(texto, id);
          setTimeout(() => {
            setMostrarRegistroArticulo(false);
          }, 2000);
        } else {
          let texto = res.data;
          let id = "error al agregar el articulo";
          notificacionNegativa(texto, id);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const modificarArticulo = (e) => {
    e.preventDefault();
    setMostrarModificarArticulo(true);
    setArticuloModificacion({
      ...articuloModificacion,
      codigo: articuloResponse.codigo,
    });
  };

  const solicitarModificarArticulo = (e) => {
    e.preventDefault();
    const datos = {
      titulo: "Modificar artículo",
      texto: "Estás seguro que deseas modificar el artículo?",
      textoBotonConfirmacion: "Modificar",
      textoBotonCancelar: "Cancelar",
    };

    const accion = () => {
      axios
        .put("http://localhost:8080/api/articulos", articuloModificacion)
        .then((res) => {
          console.log(res);
          notificacionPositiva("Artículo modificado correctamente");
          setArticuloModificacion(null);
          setTimeout(() => {
            setMostrarModificarArticulo(false);
            setArticuloResponse(null);
            buscarArticulo(e);
          }, 2000);
        })
        .catch((err) => {
          console.log(err);
          notificacionNegativa(err.response.data);
        });
    };

    modalConfirmacion(datos, accion);
  };

  const ocultarModificarArticulo = (e) => {
    e.preventDefault();
    setMostrarModificarArticulo(false);
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
              <h3 className={styles.H1Articulo}>Gestionar artículos</h3>
              <form
                onSubmit={buscarArticulo}
                className={styles.formBuscarArticulo}
              >
                <div className={styles.divBuscarArticuloInput}>
                  <label className={styles.labelArticulo} htmlFor="">
                    Artículo
                  </label>
                  <input
                    onChange={(e) => setCodigoArticulo(e.target.value)}
                    type="number"
                    required
                    placeholder="Código"
                    id="codigoBuscar"
                  />
                </div>

                <button className={styles.btnBuscarArticulo}>Buscar</button>
                <button
                  className={styles.btnAgregarArticulo}
                  onClick={mostrarAñadirArticulo}
                >
                  Agregar
                </button>
              </form>
              {articuloResponse ? (
                <section className={styles.divArticuloEncontrado}>
                  {/* <h3>
                    <b>{articuloResponse.codigo}</b>
                  </h3> */}
                  <h3>
                    <b> {articuloResponse.descripcion}</b>
                  </h3>
                  <h3>
                    <b>{articuloResponse.marca.descripcion}</b>
                  </h3>
                  {/* <h3>
                    Categoria: <b>{articuloResponse.categoria.descripcion}</b>
                  </h3> */}
                  <h3>
                    Costo: <b>${articuloResponse.costo}</b>
                  </h3>
                  <h3>
                    Margen de ganancia:{" "}
                    <b>{articuloResponse.margenGanancia * 100}%</b>
                  </h3>
                  <h3>
                    Precio: <b>${precio}</b>
                  </h3>
                  <h3>
                    Tipo de talle:{" "}
                    <b>{articuloResponse.tipoTalle.descripcion}</b>
                  </h3>
                  <button
                    onClick={(e) => {
                      modificarArticulo(e, articuloResponse.codigo);
                    }}
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
                  <h3 className={styles.h3Modificar}>Agregar</h3>
                  <form onSubmit={registrarArticulo} action="">
                    <div className={styles.divPares}>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelCodigo}
                          htmlFor="inputCodigo"
                        >
                          Codigo
                        </label>
                        <input
                          required
                          // placeholder="Codigo"
                          type="number"
                          name="codigo"
                          onChange={(e) => {
                            setArticuloRegistro({
                              ...articuloRegistro,
                              codigo: e.target.value,
                            });
                          }}
                          id="inputCodigo"
                        />
                      </div>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelDescripcion}
                          htmlFor="inputDescripcion"
                        >
                          Descripción
                        </label>
                        <input
                          required
                          // placeholder="Descripcion"
                          type="text"
                          name="descripcion"
                          id="inputDescripcion"
                          onChange={(e) => {
                            setArticuloRegistro({
                              ...articuloRegistro,
                              descripcion: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.divPares}>
                      <div className={styles.divInputs}>
                        <label className={styles.labelMarca} htmlFor="marcas">
                          Marca
                        </label>
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
                          <option value="">Seleccione</option>
                          {marcas.map((marca) => (
                            <option key={marca.id} value={marca.id}>
                              {marca.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelCategoria}
                          htmlFor="categorias"
                        >
                          Categoría
                        </label>
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
                          <option value="">Seleccione</option>
                          {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={styles.divPares}>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelCosto}
                          htmlFor="inputCosto"
                        >
                          Costo
                        </label>
                        <input
                          required
                          type="number"
                          name="costo"
                          id="inputCosto"
                          onChange={(e) => {
                            setArticuloRegistro({
                              ...articuloRegistro,
                              costo: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelMargenGanancia}
                          htmlFor="inputMargenGanancia"
                        >
                          Margen de ganancia
                        </label>
                        <input
                          required
                          //type="number"
                          id="inputMargenGanancia"
                          name="margenGanancia"
                          onChange={(e) => {
                            setArticuloRegistro({
                              ...articuloRegistro,
                              margenGanancia: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.divPares}>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelTipoTalle}
                          htmlFor="tiposTalle"
                        >
                          Tipo de talle
                        </label>
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
                          <option value="">Seleccione</option>
                          {tiposTalle.map((tipoTalle) => (
                            <option key={tipoTalle.id} value={tipoTalle.id}>
                              {tipoTalle.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={styles.divBotonera}>
                      <button id="btnRegistrar" className={styles.btnRegistrar}>
                        Confirmar
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
              {mostrarModificarArticulo ? (
                <div className={styles.divRegistroArticulo}>
                  <h3 className={styles.h3Modificar}>Modificar</h3>
                  <form onSubmit={solicitarModificarArticulo} action="">
                    <div className={styles.divPares}>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelCodigo}
                          htmlFor="inputCodigoM"
                        >
                          Código
                        </label>
                        <input
                          required
                          type="number"
                          name="codigo"
                          value={articuloResponse.codigo}
                          id="inputCodigoM"
                          readOnly
                        />
                      </div>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelDescripcion}
                          htmlFor="inputDescripcionM"
                        >
                          Descripción
                        </label>
                        <input
                          required
                          type="text"
                          name="descripcion"
                          id="inputDescripcionM"
                          onChange={(e) => {
                            setArticuloModificacion({
                              ...articuloModificacion,
                              descripcion: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.divPares}>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelDescripcion}
                          htmlFor="marcasM"
                        >
                          Marca
                        </label>
                        <select
                          className={styles.selects}
                          name="marcas"
                          id="marcasM"
                          required
                          onChange={(e) => {
                            setArticuloModificacion({
                              ...articuloModificacion,
                              marca: {
                                id: e.target.value,
                                descripcion:
                                  e.target.options[e.target.selectedIndex].text,
                              },
                            });
                          }}
                        >
                          <option value="">Seleccione</option>
                          {marcas.map((marca) => (
                            <option key={marca.id} value={marca.id}>
                              {marca.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelDescripcion}
                          htmlFor="categoriasM"
                        >
                          Categoría
                        </label>
                        <select
                          className={styles.selects}
                          name="categorias"
                          id="categoriasM"
                          required
                          onChange={(e) => {
                            setArticuloModificacion({
                              ...articuloModificacion,
                              categoria: {
                                id: e.target.value,
                                descripcion:
                                  e.target.options[e.target.selectedIndex].text,
                              },
                            });
                          }}
                        >
                          <option value="">Seleccione</option>
                          {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={styles.divPares}>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelDescripcion}
                          htmlFor="inputCostoM"
                        >
                          Costo
                        </label>
                        <input
                          required
                          type="number"
                          id="inputCostoM"
                          name="costo"
                          onChange={(e) => {
                            setArticuloModificacion({
                              ...articuloModificacion,
                              costo: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelMargenGanancia}
                          htmlFor="inputMargenGananciaM"
                        >
                          Margen de ganancia
                        </label>
                        <input
                          required
                          type="text"
                          id="inputMargenGananciaM"
                          name="margenGanancia"
                          onChange={(e) => {
                            setArticuloModificacion({
                              ...articuloModificacion,
                              margenGanancia: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className={styles.divPares}>
                      <div className={styles.divInputs}>
                        <label
                          className={styles.labelMargenGanancia}
                          htmlFor="tiposTalleM"
                        >
                          Tipo de talle
                        </label>
                        <select
                          className={styles.selects}
                          name="tiposTalle"
                          id="tiposTalleM"
                          required
                          onChange={(e) => {
                            setArticuloModificacion({
                              ...articuloModificacion,
                              tipoTalle: {
                                id: e.target.value,
                                descripcion:
                                  e.target.options[e.target.selectedIndex].text,
                              },
                            });
                          }}
                        >
                          <option value="">Seleccione</option>
                          {tiposTalle.map((tipoTalle) => (
                            <option key={tipoTalle.id} value={tipoTalle.id}>
                              {tipoTalle.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={styles.divBotonera}>
                      <button id="btnModificar" className={styles.btnRegistrar}>
                        Confirmar
                      </button>
                      <button
                        className={styles.btnCancelar}
                        onClick={ocultarModificarArticulo}
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
