import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

// const apiUrl = "https://656c1b6d-56fe-49d4-b329-706270ee6383.e1-eu-north-azure.choreoapps.dev/choreo-apis/cinemax/backend/v1/";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl,
})

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default api
