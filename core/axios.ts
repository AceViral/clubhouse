import axios from "axios";
import { parseCookies } from "nookies";

const cookies = parseCookies();

export const Axios = axios.create({
   baseURL: "http://localhost:3000",
   withCredentials: true,
});
