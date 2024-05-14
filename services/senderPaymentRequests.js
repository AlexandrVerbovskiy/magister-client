import axios from "axios";
import { initAxios } from "../utils";
const { get, post, generateFullUrl } = initAxios("/sender-payments");

export const paypalCreateOrder = async (amount, orderId, authToken) => {
  const data = await post(
    `/paypal-create-order`,
    { orderId, amount },
    authToken
  );
  return data.body.id;
};

export const getSenderPaymentList = async (body, authToken) => {
  const data = await post("/list", body, authToken);
  return data.body;
};

export const getAdminSenderPaymentList = async (body, authToken) => {
  const data = await post("/admin-list", body, authToken);
  return data.body;
};

export const generateInvoicePdf = async (id, authToken) => {
  const url = generateFullUrl(`/invoice-pdf/${id}`);

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      Connection: 'Keep-Alive',
      "Content-Type": "application/pdf",
    },
    responseType: "arraybuffer",
  });

  const pdfBlob = new Blob([response.data], { type: "application/pdf" });
  const pdfUrl = URL.createObjectURL(pdfBlob);
  return pdfUrl;
};

//export const invoicePdfUrl = (id) => generateFullUrl(`/invoice-pdf/${id}`);
