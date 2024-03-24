import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_SERVER_URL;

const Api = axios.create({ baseURL: BASE_URL, withCredentials: true });

Api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      const { data } = error.response;
      toast.error(data);
      console.log(data.message);
    } else {
      console.log(error);
    }
    return Promise.reject(error);
  }
);

export default Api;