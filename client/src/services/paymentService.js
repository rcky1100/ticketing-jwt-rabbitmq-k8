import http from "./httpService";

const apiEndpoint =
  (import.meta.env.VITE_PAYMENT_API_URL || "") + "/api/payments";

export const makePayment = async (payment) => {
  return http.post(apiEndpoint, payment);
};
