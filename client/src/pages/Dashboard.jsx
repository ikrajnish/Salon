import React, { useEffect, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import QRCode from "react-qr-code";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);
  const [remainingDays, setRemainingDays] = useState(0);

  const membershipType = user?.membership?.type;

  const totalSavings = bookings.reduce(
    (acc, b) => acc + (b.amount - b.finalAmount),
    0
  );

  const avgSavings =
    bookings.length > 0 ? (totalSavings / bookings.length).toFixed(2) : 0;

  // Loyalty stars (1 star per 3 bookings)
  const stars = Math.floor(bookings.length / 3);

  // Streak calculation
  const streak = calculateStreak(bookings);

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

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      setBookings(
        res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
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

  const bgGradient =
    membershipType === "Gold"
      ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
      : membershipType === "Silver"
      ? "bg-gradient-to-r from-gray-300 to-gray-500"
      : "bg-gradient-to-r from-blue-400 to-blue-600";

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.firstName}</h1>

      {/* Membership Card */}
      <div
        className={`${bgGradient} text-white p-5 rounded-2xl shadow-md flex flex-col items-center mb-6 transition-all`}
      >
        <p className="text-lg font-semibold tracking-wide">
          {membershipType} Membership
        </p>

        {user.membership?.expiresAt && (
          <p className="text-sm mt-1">
            Expires on {new Date(user.membership.expiresAt).toLocaleDateString()}
          </p>
        )}

        <p className="text-sm mt-1">
          Remaining days: <span className="font-bold">{remainingDays}</span>
        </p>

        {user.membership?.qrCodeToken && (
          <button
            onClick={() => setShowQR(true)}
            className="mt-3 px-4 py-2 bg-black/40 backdrop-blur text-white rounded-lg font-medium hover:bg-black/60 transition-all"
          >
            Show Membership Code
          </button>
        )}
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-4 mb-6 p-2">
        <div className="p-4 bg-white rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Total Bookings</p>
          <p className="text-xl font-bold">{bookings.length}</p>
        </div>

        <div className="p-4 bg-white rounded-xl shadow text-center ">
          <p className="text-gray-500 text-sm">Total Savings</p>
          <p className="text-xl font-bold text-green-600">₹{totalSavings}</p>
        </div>

        <div className="p-4 bg-white rounded-xl shadow text-center">
          <p className="text-gray-500 text-sm">Avg Savings per Booking</p>
          <p className="text-xl font-bold text-blue-600">₹{avgSavings}</p>
        </div>
      </div>

      {/* Loyalty Stars + Streak Section */}
      <div className="p-4 rounded-xl bg-white shadow text-center mb-6">
        <p className="text-gray-600 text-sm">Your Current Streak</p>
        <p className="text-3xl font-bold text-orange-600">{streak}🔥</p>

        <div className="flex justify-center mt-3 gap-1">
          {Array.from({ length: stars }).map((_, index) => (
            <span key={index} className="text-yellow-500 text-2xl">⭐</span>
          ))}
        </div>

        <p className="text-gray-500 mt-1 text-sm">
          {stars} Loyalty Stars earned (1 per 3 bookings)
        </p>
      </div>

      {/* Booking List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Your Bookings</h2>

        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="
                bg-white/70 backdrop-blur-lg 
                p-4 rounded-xl shadow-sm border 
                mb-4 transition-all 
                hover:shadow-lg hover:-translate-y-1
                animate-fadeUp
              "
            >
              {/* Top Row */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {b.services.join(", ")}
                </h3>

                <span
                  className={`
                    px-3 py-1 rounded-full text-sm font-medium 
                    ${b.status === "Completed" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-blue-100 text-blue-700"
                    }
                  `}
                >
                  {b.status}
                </span>
              </div>

              {/* Date & Time */}
              <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  📅 {new Date(b.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  ⏰ {b.timeSlot}
                </span>
              </div>

              {/* Price Section */}
              <div className="border-t pt-3 flex justify-between items-center">
                <p className="text-gray-700 font-medium">
                  Paid: <span className="text-green-600 font-bold">₹{b.finalAmount}</span>
                </p>

                <p className="text-red-500 line-through text-sm font-semibold">
                  ₹{b.amount}
                </p>
              </div>

              {/* Savings Indicator */}
              <p className="mt-2 text-sm text-purple-600 font-medium">
                You saved ₹{b.amount - b.finalAmount} 🎉
              </p>
            </div>
          ))
        )}
      </div>

      {/* Fullscreen QR Modal */}
      {showQR && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowQR(false)}
        >
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <QRCode
              value={JSON.stringify({
                email: user.email,
                membershipType: user.membership?.type,
                qrCodeToken: user.membership?.qrCodeToken,
              })}
              size={230}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// Helper: calculate streak
function calculateStreak(bookings) {
  if (bookings.length === 0) return 0;

  const dates = bookings
    .map((b) => new Date(b.date).toDateString())
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .sort((a, b) => new Date(a) - new Date(b));

  let streak = 1;
  for (let i = dates.length - 1; i > 0; i--) {
    const diff =
      (new Date(dates[i]) - new Date(dates[i - 1])) / (1000 * 60 * 60 * 24);

    if (diff === 1) streak++;
    else break;
  }
  return streak;
}
