export async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        const data = await response.json();
        
        if (!response.ok) {
            throw data;
        }
        
        return data;
    } catch (error) {
        console.error('Error in API request: ', error);
        throw error;
    }
}

export const API_URL = import.meta.env.VITE_API_URL;