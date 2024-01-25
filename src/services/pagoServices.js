import axios from "axios";
import toast from "react-hot-toast";

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
        toast.success("Tarjeta validada", {
          position: "bottom-right",
          duration: 2000,
          id: "Tarjeta validada",
        });
        realizarPago(response.data.id);
      } else {
        toast.error("Tarjeta no validada", {
          position: "bottom-right",
          duration: 2000,
          id: "Tarjeta no validada",
        });
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
        toast.success("Pago realizado", {
          position: "bottom-right",
          duration: 2000,
          id: "Pago realizado",
        });
        //realizarVenta();
      } else {
        toast.error("Pago no realizado", {
          position: "bottom-right",
          duration: 2000,
          id: "Pago no realizado",
        });
      }
    })
    .then((error) => {
      console.log(error);
    });
}
