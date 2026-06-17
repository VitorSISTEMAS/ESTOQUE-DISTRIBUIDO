import axios from "axios"

export const queryApi = axios.create({
  baseURL: import.meta.env.VITE_QUERY_API_URL || "http://localhost:3002"
})
