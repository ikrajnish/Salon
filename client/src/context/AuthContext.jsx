import React from "react";
import {  createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email) => {
    const API = import.meta.env.VITE_API_BASE_URL;
    const res = await axios.post(`${API}/api/auth/login`, { email });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const loadUser = async () => {
    const API = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    try {
      const res = await axios.get(`${API}/api/auth/me`, {
        headers: { Authorization: token },
      });
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("token");
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
