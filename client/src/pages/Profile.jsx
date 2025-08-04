import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Profile = () => {
  const saved = JSON.parse(localStorage.getItem("user"));
  const [firstName, setFirstName] = useState(saved?.firstName || "");
  const [profilePic, setProfilePic] = useState(saved?.profilePic || "");
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    await API.post("/auth/signup", {
      phone: saved.phone,
      firstName,
      profilePic,
      referredBy: saved.referredBy || null,
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5ECE3] p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 w-full max-w-md">
        <h2 className="text-[#5D4037] text-xl font-semibold mb-4">Complete Profile</h2>
        <input
          type="text" placeholder="First Name" className="w-full border p-2 rounded mb-3"
          value={firstName} onChange={e=>setFirstName(e.target.value)} required />
        <input
          type="text" placeholder="Profile Image URL" className="w-full border p-2 rounded mb-3"
          value={profilePic} onChange={e=>setProfilePic(e.target.value)} />
        <button className="w-full bg-[#8D6E63] text-white py-2 rounded">Save</button>
      </form>
    </div>
  );
};

export default Profile;
