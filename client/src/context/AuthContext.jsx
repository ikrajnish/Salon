import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase.config";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingRedirect, setCheckingRedirect] = useState(true);

  // 🔹 Login with Google
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      const res = await API.post("/auth/google", { idToken });

      // Prefer backend-provided firstName, fall back to Firebase displayName or backend name
      const derivedFirstName =
        res.data?.user?.firstName ||
        res.data?.user?.name ||
        (result.user.displayName ? result.user.displayName.split(" ")[0] : "");

      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        firstName: derivedFirstName,
        profilePic: res.data?.user?.profilePic || result.user.photoURL || "",
        isAdmin: res.data?.user?.isAdmin || false,
        membership: res.data?.user?.membership || null,
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

  // 🔹 Logout (instant context reset + Firebase sign-out)
  const logout = async () => {
    try {
      await signOut(auth); // Firebase signout
    } catch (e) {
      console.warn("Firebase signOut error:", e);
    }

    // Clear storage + reset immediately
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  // 🔹 Restore user session on mount
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
        setUser,
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
