import axios from "axios";
import {
  notificacionPagoRealizado,
  notificacionPagoNoRealizado,
  notificacionDatosDeTarjetaInvalidos,
  notificacionTarjetaNoValida,
} from "../helpers/notificaciones";

export function solicitarTokenPago(tarjeta, setSelect) {
  let fecha = tarjeta.fechaVencimiento;
  let partes = fecha.split("/");
  let year = partes[1];
  let month = partes[0];

  if (
    tarjeta.fechaVencimiento.match(/^(((0)[0-9])|((1)[0-2]))(\/)\d{2}$/) &&
    tarjeta.numeroTarjeta.match(/^\d{16}$/) &&
    tarjeta.codigoSeguridad.match(/^\d{3}$/) &&
    tarjeta.dniTitular.match(/^\d{8}$/) &&
    tarjeta.nombreTitular.match(/^[a-zA-Z\s]+$/)
  ) {
    const data = {
      card_number: `${tarjeta.numeroTarjeta}`,
      card_expiration_month: month,
      card_expiration_year: year,
      security_code: tarjeta.codigoSeguridad,
      card_holder_name: tarjeta.nombreTitular,
      card_holder_identification: {
        type: "dni",
        number: tarjeta.dniTitular,
      },
    };

    const headers = {
      apikey: "b192e4cb99564b84bf5db5550112adea",
    };

    solicitudTokenPago(data, headers, setSelect);
  } else {
    notificacionDatosDeTarjetaInvalidos();
  }
}

function solicitudTokenPago(data, headers, setSelect) {
  axios
    .post("https://developers.decidir.com/api/v2/tokens", data, {
      headers: headers,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.status === "active") {
        realizarPago(response.data.id, response.data.bin, setSelect);
      } else {
        notificacionTarjetaNoValida();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function realizarPago(id, bin, setSelect) {
  if (sessionStorage.getItem("counter") == null) {
    sessionStorage.setItem("counter", Math.floor(Math.random() * 1000000) + 1);
  }

  let counterValue = Number(sessionStorage.getItem("counter"));
  sessionStorage.setItem("counter", counterValue + 1);

  console.log("Counter Value:", sessionStorage.getItem("counter"));

  const headers = {
    apikey: "566f2c897b5e4bfaa0ec2452f5d67f13",
  };

  //create a count for the site_transaction_id
  const data = {
    site_transaction_id: `${counterValue}`, //este id debe cambiar
    payment_method_id: 1,
    token: `${id}`,
    bin: bin,
    amount: parseFloat(window.localStorage.getItem("total")),
    currency: "ARS",
    installments: 1,
    description: "",
    payment_type: "single",
    establishment_name: "single",
    sub_payments: [
      {
        site_id: "",
        amount: parseFloat(window.localStorage.getItem("total")),
        installments: null,
      },
    ],
  };
  solicitudRealizarPago(data, headers, setSelect);
}

function solicitudRealizarPago(data, headers, setSelect) {
  axios
    .post("https://developers.decidir.com/api/v2/payments", data, {
      headers: headers,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.status === "approved") {
        notificacionPagoRealizado();
        setTimeout(() => {
          setSelect("efectivo");
        }, 2000);
        //realizarVenta();
      } else {
        notificacionPagoNoRealizado();
      }
    })
    .catch((error) => {
      console.log(error);
      notificacionTarjetaNoValida();
      notificacionPagoNoRealizado();
    });
}

export function determinarTipoComprobante(
  idCondicionTributaria,
  setTipoComprobanteAEmitir
) {
  axios
    .get("http://localhost:8080/determinarTipoComprobanteAEmitir", {
      params: {
        idCondicionTributariaCliente: idCondicionTributaria,
      },
    })
    .then((res) => {
      setTipoComprobanteAEmitir(res.data);
    });
}
