import http from "./httpService";

const apiEndpoint = "/api/orders";
export const getOrders = async () => {
  return http.get(apiEndpoint);
};

export const getOrder = async (orderId) => {
  return http.get(apiEndpoint + "/" + orderId);
};

export const createOrder = async (order) => {
  return http.post(apiEndpoint, order);
};
