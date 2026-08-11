import axios from 'axios';

const clienteAxios = axios.create({
    // Asegúrate de que esta sea la URL correcta de tu backend en Laravel
    baseURL: '/api' 
});

// "Interceptor": Antes de que cualquier petición salga hacia Laravel, 
// Axios revisará si tienes un Token guardado y lo adjuntará en los "Headers" (cabeceras).
clienteAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default clienteAxios;