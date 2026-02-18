import axios from 'axios'

export const axiosInstance= axios.create({
    baseURL:import.meta.env.MODE==="development"?"https://konvo-1.onrender.com/api":"/api",
    withCredentials:true
})

// - includes credentials: Setting withCredentials: true ensures that cookies and authentication data are sent with requests, useful for handling sessions.
