import axios from "axios";
import { initInterceptor } from "./interceptor";

export const axiosInstance = axios.create({
  baseURL: "http://185.46.11.82/api",
  //baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

initInterceptor(axiosInstance);