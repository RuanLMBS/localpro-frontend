import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', 
});

api.interceptors.request.use(async config => {
  const token = localStorage.getItem('@LocalPro:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status ===401) {
      localStorage.removeItem('@LocalPro:token');

      window.location.reload();
    }
    return Promise.reject(error)
  }
)

export default api;