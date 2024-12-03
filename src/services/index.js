import axios from "axios";

const baseURL =`/api`;

export const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 100000,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});