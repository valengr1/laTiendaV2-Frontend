import { useNavigate } from "react-router-dom";
import styles from "../styles/GestionarArticulo.module.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";
import {
  articuloEliminadoCorrectamente,
  notificacionArticuloInexistente,
} from "../helpers/notificaciones";
import { modalConfirmacion } from "../helpers/modales";

function GestionarArticulos() {
  useEffect(() => {
    setArticuloResponse(null);
    setMostrarRegistroArticulo(false);
  }, []);
  const navigate = useNavigate();
  const [codigoArticulo, setCodigoArticulo] = useState(0);
  const [articuloResponse, setArticuloResponse] = useState({
    codigo: 0,
    descripcion: "",
    marca: "",
    categoria: "",
    precio: 0,
    tipoTalle: "",
  });
  const [mostrarRegistroArticulo, setMostrarRegistroArticulo] = useState(false);

  const cancelarGestionCliente = () => {
    navigate("/inicio");
  };

  const buscarArticulo = (e) => {
    e.preventDefault();
    axios
      .get("http://localhost:8080/articulo", {
        params: { codigo: codigoArticulo },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data === "") {
          notificacionArticuloInexistente();
        }
        setArticuloResponse(res.data);
      });
    setMostrarRegistroArticulo(false);
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
              <form className={styles.formBuscarArticulo}>
                <input
                  onChange={(e) => setCodigoArticulo(e.target.value)}
                  type="number"
                  placeholder="Código"
                  required
                  id="codigoBuscar"
                />
                <button
                  className={styles.btnBuscarArticulo}
                  onClick={buscarArticulo}
                >
                  Buscar
                </button>
                <button
                  className={styles.btnAgregarArticulo}
                  onClick={mostrarAñadirArticulo}
                >
                  Añadir
                </button>
              </form>
              {articuloResponse ? (
                <section className={styles.divArticuloEncontrado}>
                  <h3>Codigo: {articuloResponse.codigo}</h3>
                  <h3>Descripcion: {articuloResponse.descripcion}</h3>
                  <h3>Marca: {articuloResponse.marca}</h3>
                  <h3>Categoria: {articuloResponse.categoria}</h3>
                  <h3>Precio: {articuloResponse.precio}</h3>
                  <h3>Tipo de talle: {articuloResponse.tipoTalle}</h3>
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
                        // onChange={(e) => {
                        //   setClienteRegistro({
                        //     ...clienteRegistro,
                        //     dni: e.target.value,
                        //   });
                        // }}
                      />
                      <input
                        required
                        placeholder="Descripcion"
                        type="text"
                        name="descripcion"
                        // onChange={(e) => {
                        //   setClienteRegistro({
                        //     ...clienteRegistro,
                        //     nombre: e.target.value,
                        //   });
                        // }}
                      />
                    </div>
                    <div className={styles.divPares}>
                      <input
                        required
                        placeholder="Marca"
                        type="text"
                        name="marca"
                        // onChange={(e) => {
                        //   setClienteRegistro({
                        //     ...clienteRegistro,
                        //     apellido: e.target.value,
                        //   });
                        // }}
                      />
                      <input
                        required
                        placeholder="Categoria"
                        type="text"
                        name="categoria"
                        // onChange={(e) => {
                        //   setClienteRegistro({
                        //     ...clienteRegistro,
                        //     direccion: e.target.value,
                        //   });
                        // }}
                      />
                    </div>
                    <div className={styles.divPares}>
                      <input
                        required
                        placeholder="Precio"
                        type="number"
                        name="precio"
                        // onChange={(e) => {
                        //   setClienteRegistro({
                        //     ...clienteRegistro,
                        //     telefono: e.target.value,
                        //   });
                        // }}
                      />
                      <input
                        required
                        placeholder="Tipo de talle"
                        type="text"
                        name="tipoTalle"
                        // onChange={(e) => {
                        //   setClienteRegistro({
                        //     ...clienteRegistro,
                        //     telefono: e.target.value,
                        //   });
                        // }}
                      />
                    </div>
                    <div className={styles.divBotonera}>
                      <button className={styles.btnRegistrar}>Registrar</button>
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
