import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-20">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" />;

  return children;
};

export default PrivateRoute;
