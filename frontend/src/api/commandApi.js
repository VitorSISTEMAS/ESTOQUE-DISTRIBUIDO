import axios from "axios";

export const commandApi = axios.create({
  baseURL: import.meta.env.VITE_COMMAND_API_URL || "http://localhost:3001"
});
