import http from "./httpService";

const apiEndpoint = (import.meta.env.VITE_AUTH_API_URL || "") + "/api";
export const register = async (user) => {
  return http.post(apiEndpoint + "/users/signup", {
    email: user.username,
    password: user.password,
    name: user.name,
  });
};

export const login = async (email, password) => {
  return http.post(apiEndpoint + "/users/signin", {
    email: email,
    password: password,
  });
};

export const currentUser = async () => {
  return http.get(apiEndpoint + "/users/currentuser");
};
