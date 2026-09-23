import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000/api';
axios.defaults.baseURL = API;

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/profile/').then(r => { setUser(r.data); setLoading(false); })
        .catch(() => { localStorage.clear(); setLoading(false); });
    } else setLoading(false);
  }, []);

  const login = async (email, password) => {
    const r = await axios.post('/auth/login/', { email, password });
    localStorage.setItem('access', r.data.access);
    localStorage.setItem('refresh', r.data.refresh);
    axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.access}`;
    setUser(r.data.user);
    return r.data;
  };

  const register = async (username, email, password) => {
    const r = await axios.post('/auth/register/', { username, email, password });
    localStorage.setItem('access', r.data.access);
    localStorage.setItem('refresh', r.data.refresh);
    axios.defaults.headers.common['Authorization'] = `Bearer ${r.data.access}`;
    setUser(r.data.user);
    return r.data;
  };

  const logout = () => {
    localStorage.clear();
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const refreshUser = async () => {
    const r = await axios.get('/profile/');
    setUser(r.data);
    return r.data;
  };

  return <AuthContext.Provider value={{ user, login, register, logout, loading, refreshUser }}>
    {children}
  </AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
export { axios };
