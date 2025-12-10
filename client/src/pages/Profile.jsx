import React, { useState } from "react";
import API from "../api/axios";
import { LogOut } from "lucide-react";
import StatsSection from "../components/StatsSection";
import { Pencil } from "lucide-react";


const CLOUDINARY_UPLOAD_PRESET = "ml_default";
const CLOUDINARY_CLOUD_NAME = "dlbgabdi1";
const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

const Profile = () => {
  const saved = JSON.parse(localStorage.getItem("user"));

  const [firstName, setFirstName] = useState(saved?.firstName || "");
  const [email] = useState(saved?.email || "");
  const [image, setImage] = useState(saved?.profilePic || "/default-avatar.png");
  const [preview, setPreview] = useState(saved?.profilePic || "/default-avatar.png");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const membershipInfo = {
    Normal: { discount: 0 },
    Silver: { discount: 10 },
    Gold: { discount: 20 },
  };

  const membership = saved?.membership || { type: "Normal" };
  const info = membershipInfo[membership.type];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_API, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        setImage(data.secure_url);
      } else {
        console.error("Cloudinary upload error:", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const { data } = await API.put("/user/profile", {
        firstName,
        profilePic: image,
      });

      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      console.error("Profile update failed:", err.response?.data || err);
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] p-6 flex justify-center pt-20">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-[12px] shadow-sm p-6 flex flex-col">

        <h2 className="text-[24px] font-semibold text-[#21252B] mb-6">
          Profile
        </h2>

        {/* Avatar */}
        <div className="flex gap-[10px] items-center mb-5">
          <div className="relative w-[60px] h-[60px]">
            <img
              src={preview}
              alt="Profile"
              className="rounded-full w-[60px] h-[60px] object-cover border"
            />

            {membership.type !== "Normal" && (
              <span
                className={`absolute bottom-0 right-0 text-[10px] px-1 py-[1px] rounded-full font-semibold ${
                  membership.type === "Gold"
                    ? "bg-yellow-400 text-white"
                    : "bg-gray-500 text-white"
                }`}
              >
                {membership.type}
              </span>
            )}

            <label className="absolute top-0 right-0 bg-white rounded-full p-[4px] shadow cursor-pointer hover:bg-gray-200 transition border">
              <Pencil size={14} className="text-gray-700" />
              <input type="file" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Membership Info */}
          <div className="flex flex-col">
            <span
              className={`text-[12px] px-2 py-[2px] rounded-full font-medium ${
                membership.type === "Gold"
                  ? "bg-yellow-100 text-yellow-700"
                  : membership.type === "Silver"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {membership.type}
            </span>

            <span className="text-[12px] text-gray-600 mt-1">
              Discount: {info.discount}%
            </span>

            {membership.expiresAt && (
              <span className="text-[12px] text-red-600">
                Expires: {new Date(membership.expiresAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3 text-[14px] text-[#21252B] mb-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-full font-medium border h-[56px] border-[#E9EAEC] rounded-[8px] px-3 py-2 outline-none"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              value={email}
              disabled
              className="mt-1 w-full text-[#8E9196] border h-[56px] border-gray-200 rounded-[8px] px-3 py-2 bg-gray-50"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full h-[56px] bg-[#E7F7EF] text-[#097C44] font-medium rounded-[8px] py-2 text-[14px]"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>

        <hr className="my-5" />

        {/* Stats Section with margin fix */}
        <div className="mt-6">
          <StatsSection />
        </div>

        {/* Logout */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 text-[16px] hover:text-red-500 transition"
          >
            <LogOut size={24} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
