import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// - includes credentials: Setting withCredentials: true ensures that cookies and authentication data are sent with requests, useful for handling sessions.
