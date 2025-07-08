import React from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email) return setError("Email is required");
    setError("");

    try {
      await login(email);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.msg || "Login failed";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">Login to Mores</h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
