import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";
import { apiRequest, API_URL } from "../../utils/api";
import PropTypes from 'prop-types';
import { toast } from "react-toastify";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function userLogin(data) {
    try {
      const res = await apiRequest(`${API_URL}/api/auth/login`, {
        method: 'post',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })

      setUser(res.user)
      setToken(res.token)

      localStorage.setItem('user', JSON.stringify(res.user))
      localStorage.setItem('token', res.token)

      setError('')

      navigate('/')
    } catch(error) {
      error.details.forEach((e) => {
        toast.error(e.msg);
      })
      setError(error);
    }
  }

  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem('user')
  };

  return (
    <AuthContext.Provider value={{ token, user, userLogin, logOut, error }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.array
}