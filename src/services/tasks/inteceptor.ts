import axios, { AxiosError } from "axios"


const api = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'VERCEL_AUTOMATION_BYPASS_SECRET': process.env.VUE_APP_VERCEL_AUTOMATION_BYPASS_SECRET
    },
})

api.interceptors.response.use(
    response => response,
    (error) => {
        console.error("Erro na API", error.response || error.message)
    return Promise.reject(error);    
    }
);
    
export default api