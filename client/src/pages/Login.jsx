import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginWithGoogle, user, checkingRedirect, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect after login
  useEffect(() => {
    if (!checkingRedirect && user) {
      navigate(user.isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, checkingRedirect, navigate]);

  // Show loader while checking redirect
  if (checkingRedirect || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5ECE3]">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-[#5D4037] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-[#5D4037] font-medium">Checking login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5ECE3] p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-[#5D4037] mb-6">Welcome to Mores</h2>

        <button
          onClick={loginWithGoogle}
          disabled={loading}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg flex items-center justify-center font-medium transition mb-3"
        >
          {loading ? (
            <span className="border-2 border-white border-t-transparent rounded-full w-6 h-6 animate-spin"></span>
          ) : (
            <>
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-6 h-6 mr-2"
              />
              Continue with Google
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default Login;
