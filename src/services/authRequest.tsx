import axios from "axios"

// created to make authenticated requests in other components
export const makeAuthenticatedRequest = async (endpoint: string, method: string = 'GET', data?: any) => {
    
    const client = axios.create({
        baseURL: 'http://jobapi.run.edu.ng/',
    });

    client.interceptors.request.use((config) => {
        const token = localStorage.getItem('authtoken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });

        return client({
            method,
            url: endpoint,
            data,
        }).then(response => response.data)
};