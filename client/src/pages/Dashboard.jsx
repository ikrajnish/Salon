import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch user's bookings from backend
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      alert("Failed to fetch your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Your Dashboard</h1>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="border p-3 rounded shadow-sm flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>{b.services.join(", ")}</strong> —{" "}
                  {new Date(b.date).toLocaleDateString()} @ {b.timeSlot}
                </p>
                <p>
                  Status: <span className="font-medium">{b.status}</span>
                </p>
                <p>
                  Amount: ₹{b.amount} | Final: ₹{b.finalAmount}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
