import http from "./httpService";

const apiEndpoint =
  (import.meta.env.VITE_TICKET_API_URL || "") + "/api/tickets";
export const getTickets = async () => {
  return http.get(apiEndpoint);
};

export const getTicket = async (ticketId) => {
  return http.get(apiEndpoint + "/" + ticketId);
};

export const saveTicket = async (ticket, id) => {
  if (id !== "new") {
    const body = { ...ticket };
    return http.put(apiEndpoint + "/" + id, body);
  }
  return http.post(apiEndpoint, ticket);
};
