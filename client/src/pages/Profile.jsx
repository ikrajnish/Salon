import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import QRCode from "react-qr-code";
import { useAuth } from "../context/AuthContext";

// Cloudinary config
const CLOUDINARY_UPLOAD_PRESET = "ml_default"; // your unsigned preset
const CLOUDINARY_CLOUD_NAME = "dlbgabdi1"; // your cloud name
const CLOUDINARY_API = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

const Profile = () => {
  const saved = JSON.parse(localStorage.getItem("user"));
  const [firstName, setFirstName] = useState(saved?.firstName || "");
  const [profilePic, setProfilePic] = useState(saved?.profilePic || "");
  const [preview, setPreview] = useState(saved?.profilePic || "");
  const [bookings, setBookings] = useState([]);
  const [remainingDays, setRemainingDays] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Membership remaining days
  useEffect(() => {
    if (user?.membership?.expiresAt) {
      const calculate = () => {
        const diff = new Date(user.membership.expiresAt) - new Date();
        setRemainingDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
      };
      calculate();
      const interval = setInterval(calculate, 24 * 60 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Handle image selection & Cloudinary upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Live preview
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
        setProfilePic(data.secure_url); // Save Cloudinary URL
      } else {
        console.error("Cloudinary upload error:", data);
      }
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  // Submit profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/google", {
        uid: saved.uid,
        email: saved.email,
        phone: saved?.phone || null,
        firstName,
        profilePic, // Cloudinary URL
        referredBy: saved?.referredBy || null,
      });

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-200 via-50% to-red-200 p-6 pt-24">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
        {/* Profile Picture */}
        <div className="relative mb-4">
          <img
            src={preview || "https://via.placeholder.com/120"}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-[#8D6E63] shadow-md"
          />
          <label className="absolute bottom-0 right-0 bg-[#8D6E63] text-white px-2 py-1 rounded-full text-xs cursor-pointer hover:bg-[#5D4037]">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {uploading ? "Uploading..." : "Upload"}
          </label>
        </div>

        {/* Edit Profile */}
        <h2 className="text-[#5D4037] text-xl font-semibold mb-4">Edit Profile</h2>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md flex flex-col gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="First Name"
            className="border p-2 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-[#8D6E63] text-white py-2 rounded hover:bg-[#5D4037] transition"
            disabled={uploading}
          >
            Save Changes
          </button>
        </form>

        {/* Membership QR */}
        <div className="w-full max-w-md bg-gray-50 border rounded-lg p-4 text-center shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-3 text-[#3E2723]">Your Membership</h2>
          {user?.membership?.qrCodeToken ? (
            <>
              <QRCode
                value={JSON.stringify({
                  email: user.email,
                  membershipType: user.membership?.type,
                  qrCodeToken: user.membership?.qrCodeToken,
                })}
                size={140}
              />
              <p className="mt-3">Type: {user.membership.type}</p>
              <p>
                Expires:{" "}
                {user.membership.expiresAt
                  ? new Date(user.membership.expiresAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="font-semibold text-green-600">
                Remaining: {remainingDays} days
              </p>
            </>
          ) : (
            <p className="text-gray-600">No active membership.</p>
          )}
        </div>
      </div>

      {/* Bookings Section */}
      <div className="max-w-6xl mx-auto mt-8 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4 text-[#3E2723]">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="border p-4 rounded shadow-sm hover:shadow-md transition"
              >
                <p>
                  <strong>Services:</strong> {b.services.join(", ")}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(b.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {b.timeSlot}
                </p>
                <p>
                  <strong>Status:</strong> {b.status}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{b.amount}
                </p>
                <p>
                  <strong>Final Amount:</strong> ₹{b.finalAmount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
