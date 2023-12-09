import axios from "axios";

const uri = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
    baseURL: uri,
    headers: { 'Content-Type': 'application/json' }
})

export default api