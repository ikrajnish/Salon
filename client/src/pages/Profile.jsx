import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Profile = () => {
  const saved = JSON.parse(localStorage.getItem("user"));
  const [firstName, setFirstName] = useState(saved?.firstName || "");
  const [profilePic, setProfilePic] = useState(saved?.profilePic || "");
  const navigate = useNavigate();

  // ✅ Submit updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/google", {
        uid: saved.uid,
        email: saved.email,
        phone: saved?.phone || null,
        firstName,
        profilePic,
        referredBy: saved?.referredBy || null,
      });

      // Update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...saved,
          firstName: data.user.firstName,
          profilePic: data.user.profilePic,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      console.error("Profile update failed", err);
    }
  };

  // ✅ Logout: clears user + token and redirects
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5ECE3] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow p-6 w-full max-w-md mb-6"
      >
        <h2 className="text-[#5D4037] text-xl font-semibold mb-4 text-center">
          Complete Profile
        </h2>

        <input
          type="text"
          placeholder="First Name"
          className="w-full border p-2 rounded mb-3"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Profile Image URL"
          className="w-full border p-2 rounded mb-3"
          value={profilePic}
          onChange={(e) => setProfilePic(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-[#8D6E63] text-white py-2 rounded hover:bg-[#5D4037] transition"
        >
          Save
        </button>
      </form>

      {/* ✅ Logout button at the bottom */}
      <button
        onClick={handleLogout}
        className="w-full max-w-md bg-[#5D4037] text-white py-2 rounded hover:bg-[#8D6E63] transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
