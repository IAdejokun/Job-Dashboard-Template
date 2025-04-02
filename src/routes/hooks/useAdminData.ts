import  axios  from 'axios';
import {useQuery} from '@tanstack/react-query';

export const useAdminData = () => {
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

    return useQuery({
      queryKey: ['adminData'],
        queryFn: async () => {
            // immediate network check 
            if (!navigator.onLine) {
                throw new Error('No internet connection');
            }

        const email = localStorage.getItem('userEmail');
        if (!email) throw new Error('No email found');

        const response = await client.get('getadminbyemail', {
          params: { emailAddy: email },
        });
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes until data is considered stale
      
        retry: (failureCount, error) => 
          // Don't retry for network errors
           error.message !== 'No internet connection' && failureCount < 2
      

    });
}
