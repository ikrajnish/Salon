import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingRedirect, setCheckingRedirect] = useState(true);

  // Login with Google
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await API.post("/auth/google", { idToken });

      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        firstName: res.data.user.firstName,
        profilePic: res.data.user.profilePic,
        isAdmin: res.data.user.isAdmin,
        membership: res.data.user.membership || null, // 🔹 include membership
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", res.data.token);
      setUser(userData);
    } catch (err) {
      console.error("❌ Google login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    await auth.signOut();
  };

  // Restore user session
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
    }
    setCheckingRedirect(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loginWithGoogle, logout, loading, checkingRedirect, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
