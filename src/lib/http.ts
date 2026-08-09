import axios from "axios";

export const http = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

export const swrFetcher = (url: string) => http.get(url).then((res) => res.data);
