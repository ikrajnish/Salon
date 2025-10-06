import React, { useEffect, useState } from "react";
import API from "../api/axios";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({}); // track fields being edited

  const [email, setEmail] = useState("");
  const [services, setServices] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [amount, setAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBookings(sorted);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Create booking
  const handleCreateBooking = async () => {
    if (!email || !services || !date || !timeSlot || !amount || !finalAmount)
      return;

    try {
      await API.post(
        "/bookings",
        {
          userEmail: email,
          services: services.split(",").map((s) => s.trim()),
          date,
          timeSlot,
          amount: parseFloat(amount),
          finalAmount: parseFloat(finalAmount),
          status: "pending",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEmail("");
      setServices("");
      setDate("");
      setTimeSlot("");
      setAmount("");
      setFinalAmount("");
      fetchBookings();
    } catch (err) {
      console.error("Failed to create booking:", err);
    }
  };

  // Handle field change locally
  const handleFieldChange = (id, field, value) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, [field]: value } : b))
    );
    setEditing((prev) => ({ ...prev, [id]: true }));
  };

  // Handle booking update
  const handleUpdate = async (id) => {
    const booking = bookings.find((b) => b._id === id);
    if (!booking) return;

    try {
      await API.put(
        `/bookings/admin/${id}`,
        {
          amount: parseFloat(booking.amount),
          finalAmount: parseFloat(booking.finalAmount),
          status: booking.status,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditing((prev) => ({ ...prev, [id]: false }));
      fetchBookings();
    } catch (err) {
      console.error("Failed to update booking:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>

      {/* Create Booking */}
      <div className="border p-4 rounded mb-6 shadow-sm">
        <h2 className="font-semibold mb-2">Create Booking for User</h2>

        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="text"
          placeholder="Services (comma-separated)"
          value={services}
          onChange={(e) => setServices(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="date"
          value={date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        />
        <select
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        >
          <option value="">Select Time Slot</option>
          <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
          <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
          <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
          <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        />
        <input
          type="number"
          placeholder="Final Amount"
          value={finalAmount}
          onChange={(e) => setFinalAmount(e.target.value)}
          className="border p-2 rounded mb-2 w-full"
        />

        <button
          onClick={handleCreateBooking}
          className="bg-[#8D6E63] text-white px-4 py-2 rounded hover:bg-[#5D4037] transition mt-2"
        >
          Create Booking
        </button>
      </div>

      {/* All Bookings */}
      <div className="space-y-3">
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="border p-3 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex flex-col md:flex-row md:items-center md:gap-6">
                <div>
                  <p>
                    <strong>{b.user?.firstName || "User"}</strong>{" "}
                    <span className="text-gray-500">({b.user?.email})</span>{" "}
                    — {new Date(b.date).toLocaleDateString()} @ {b.timeSlot}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label>Status:</label>
                  <select
                    value={b.status}
                    onChange={(e) =>
                      handleFieldChange(b._id, "status", e.target.value)
                    }
                    className="border p-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label>Amount:</label>
                  <input
                    type="number"
                    value={b.amount}
                    onChange={(e) =>
                      handleFieldChange(b._id, "amount", e.target.value)
                    }
                    className="border p-1 rounded w-24"
                  />
                  <label>Final:</label>
                  <input
                    type="number"
                    value={b.finalAmount}
                    onChange={(e) =>
                      handleFieldChange(b._id, "finalAmount", e.target.value)
                    }
                    className="border p-1 rounded w-24"
                  />
                </div>
              </div>

              {editing[b._id] && (
                <button
                  onClick={() => handleUpdate(b._id)}
                  className="bg-[#8D6E63] text-white px-3 py-1 rounded hover:bg-[#5D4037] transition mt-2 md:mt-0"
                >
                  Update
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
