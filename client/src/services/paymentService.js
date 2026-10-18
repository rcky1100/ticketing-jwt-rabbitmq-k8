import http from "./httpService";

const apiEndpoint = "/api/payments";

export const makePayment = async (payment) => {
  return http.post(apiEndpoint, payment);
};
