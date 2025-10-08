import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import QRCode from "react-qr-code";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remainingDays, setRemainingDays] = useState(0);

  useEffect(() => {
    if (user?.membership?.expiresAt) {
      const calculate = () => {
        const diff = new Date(user.membership.expiresAt) - new Date();
        setRemainingDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))));
      };
      calculate();
      const interval = setInterval(calculate, 24 * 60 * 60 * 1000); // recalc daily
      return () => clearInterval(interval);
    }
  }, [user]);

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Welcome, {user.firstName}</h1>

      {/* ✅ Always show membership info */}
      <div className="border p-4 rounded shadow-sm mb-6 flex flex-col items-center gap-2">
        <h2 className="font-semibold mb-2">Your Membership</h2>
        {user.membership?.qrCodeToken ? (
          <>
            <QRCode
              value={JSON.stringify({
                email: user.email,
                membershipType: user.membership?.type,
                qrCodeToken: user.membership?.qrCodeToken,
              })}
              size={128}
            />
            <p>Type: {user.membership.type}</p>
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
          <p>No active membership.</p>
        )}
      </div>

      {/* ✅ Bookings */}
      <div>
        <h2 className="font-semibold mb-2">Your Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="border p-3 rounded shadow-sm mb-2 flex flex-col gap-1"
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
                <strong>Amount:</strong> ₹{b.finalAmount}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
