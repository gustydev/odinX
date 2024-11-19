import { useState, useEffect } from "react";
import { apiRequest, API_URL } from "../../utils/api";
import useAuth from "../useAuth/useAuth";

export function useData(path) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = useAuth();

    useEffect(() => {
        let ignore = false;

        async function fetchData() {
            setLoading(true)
            try {
                const data = await apiRequest(`${API_URL}/api/${path}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                })
                setData(data)
            } catch (error) {
                if (import.meta.env.VITE_NODE_ENV === 'development') {
                    console.log(error)
                }
                
                setError(error)
            } finally {
                setLoading(false);
            }
        }

        if (!ignore) fetchData();

        return () => {
            ignore = true
        }
    }, [path, auth.token])

    return { data, setData, loading, error }
}