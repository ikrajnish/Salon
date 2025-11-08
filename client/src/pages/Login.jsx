import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginWithGoogle, user, checkingRedirect, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!checkingRedirect && user) {
      navigate(user.isAdmin ? "/admin" : "/dashboard");
    }
  }, [user, checkingRedirect, navigate]);

  if (checkingRedirect || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-3 text-gray-700 font-medium">Checking login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-8">

      {/* Logo */}
      {/* <img
        src="/logo.png"
        alt="Mores"
        className="h-6 mb-6"
      /> */}

      <h1 className="text-[32px] font-semibold text-[#21252B] mb-2">
        Welcome to <span className="text-[#1B1B1B]">Mores</span>
      </h1>

      <p className="text-[#21252B] mb-6 text-[18px]">
        To get started, please sign in
      </p>

      {/* Google Login */}
      <button
        onClick={loginWithGoogle}
        disabled={loading}
        className="flex items-center justify-center gap-3 border border-gray-300 bg-white rounded-xl py-3 w-full max-w-sm mb-4 hover:bg-gray-100 transition text-[18px] font-medium"
      >
        {loading ? (
          <span className="border-2 border-gray-700 border-t-transparent rounded-full w-6 h-6 animate-spin"></span>
        ) : (
          <>
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Log In with Google
          </>
        )}
      </button>

      {/* Divider */}
      <div className="flex items-center w-full max-w-sm my-4">
        <div className="h-px bg-gray-200 flex-1"></div>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      {/* You can place more auth options here later */}

    </div>
  );
};

export default Login;
