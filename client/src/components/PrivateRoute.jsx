import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, checkingRedirect } = useAuth();

  // Wait until Firebase redirect check is complete
  if (checkingRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5ECE3]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#5D4037] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-[#5D4037] font-medium">Verifying login...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) return <Navigate to="/login" />;

  // Admin route protection
  if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" />;

  return children;
};

export default PrivateRoute;
