
import React, { useEffect, useState } from "react";
import API from "../api/axios";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/admin/all")
      .then(res => setBookings(res.data))
      .catch(console.error);
  }, []);

  const handleUpdate = async (id) => {
    await API.put(`/bookings/admin/${id}`, { status: "completed", amount: 1200 });
    alert("Updated");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="mt-4 space-y-2">
        {bookings.map(b => (
          <div key={b._id} className="border p-2 rounded">
            <p><strong>{b.user.firstName}</strong> — {b.date} @ {b.timeSlot}</p>
            <button onClick={() => handleUpdate(b._id)} className="mt-1 bg-[#8D6E63] text-white px-2 py-1 rounded">
              Mark Completed
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
