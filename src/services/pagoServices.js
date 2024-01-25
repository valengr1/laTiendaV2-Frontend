import axios from "axios";
import {
  notificacionTarjetaValidada,
  notificacionTarjetaNoValidada,
  notificacionPagoRealizado,
  notificacionPagoNoRealizado,
} from "../helpers/notificaciones";

export function solicitarTokenPago(tarjeta) {
  let fecha = tarjeta.fechaVencimiento;
  let partes = fecha.split("-");
  let year = partes[0];
  let month = partes[1];

  const data = {
    card_number: tarjeta.numeroTarjeta,
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

  solicitudTokenPago(data, headers);
}

function solicitudTokenPago(data, headers) {
  axios
    .post("https://developers.decidir.com/api/v2/tokens", data, {
      headers: headers,
    })
    .then((response) => {
      if (response.data.status === "active") {
        notificacionTarjetaValidada();
        realizarPago(response.data.id);
      } else {
        notificacionTarjetaNoValidada();
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

export function realizarPago(id) {
  const headers = {
    apikey: "566f2c897b5e4bfaa0ec2452f5d67f13",
  };

  const data = {
    site_transaction_id: "3", //este id debe cambiar
    payment_method_id: 1,
    token: `${id}`,
    bin: "450799",
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

  solicitudRealizarPago(data, headers);
}

function solicitudRealizarPago(data, headers) {
  axios
    .post("https://developers.decidir.com/api/v2/payments", data, {
      headers: headers,
    })
    .then((response) => {
      console.log(response.data);
      if (response.data.status === "approved") {
        notificacionPagoRealizado();
        //realizarVenta();
      } else {
        notificacionPagoNoRealizado();
      }
    })
    .then((error) => {
      console.log(error);
    });
}