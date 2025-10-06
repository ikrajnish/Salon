import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false); // loading state for login button
  const [checkingRedirect, setCheckingRedirect] = useState(true); // initial auth check on app load

  // 🔹 Login with Google (Popup method)
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Get Firebase ID token
      const idToken = await result.user.getIdToken();

      // Call your backend
      const res = await API.post("auth/google", { idToken });
      console.log("✅ Backend response:", res.data);

      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        firstName: res.data.user.firstName,
        profilePic: res.data.user.profilePic,
        isAdmin: res.data.user.isAdmin,
      };

      // Store user and token in localStorage
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", res.data.token);

      setUser(userData);
    } catch (err) {
      console.error("❌ Google login failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logout = async () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    await auth.signOut();
  };

  // 🔹 Restore user session from localStorage on first load
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
      value={{
        user,
        loginWithGoogle,
        logout,
        loading,
        checkingRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
