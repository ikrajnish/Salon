import React from "react";
import { useState, useEffect } from "react";

const Profile = () => {
  const [form, setForm] = useState({
    firstName: "",
    email: "",
    profilePic: "",
  });

  // Load existing user from localStorage or backend
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setForm(user);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage or send to backend
    localStorage.setItem("user", JSON.stringify(form));
    alert("Profile updated!");
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="profilePic"
          value={form.profilePic}
          onChange={handleChange}
          placeholder="Profile Image URL"
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default Profile;
