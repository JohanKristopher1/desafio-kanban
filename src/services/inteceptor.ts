import axios, { AxiosError } from "axios"


const api = axios.create({
    baseURL: process.env.VUE_API_URL,
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'VERCEL_AUTOMATION_BYPASS_SECRET': process.env.VUE_VERCEL_AUTOMATION_BYPASS_SECRET
    },
})
    
export default api