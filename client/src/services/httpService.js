import axios from "axios";
import logger from "./logService";

axios.defaults.headers.common["Authorization"] =
  "Barear " + localStorage.getItem("token");
axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    logger.log("Log the error", error);
    alert("An unexpected error occurred");
  }
  return Promise.reject(error);
});

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
};
