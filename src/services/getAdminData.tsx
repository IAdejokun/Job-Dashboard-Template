import axios from "axios";

export const getAdminData = async () => {
    const email = localStorage.getItem ('email');

    if (!email) {
        throw new Error ('Email not found');
    }

    const client = axios.create({
    baseURL: 'http://jobapi.run.edu.ng/',
  });

  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
    
     try {
       const response = await client.get('getadminbyemail', {
         params: {
           emailAddy: email,
         },
       });
       return response.data;
     } catch (error) {
       console.error('Error fetching admin data:', error);
       throw error;
     }
    
}