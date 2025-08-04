import React, { useEffect, useState } from "react";
import API from "../api/axios";

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  useEffect(() => {
    API.get("/bookings/2025-08-01")
      .then(res => setSlots(res.data))
      .catch(console.error);
  }, []);

  const handleBooking = async () => {
    await API.post("/bookings", {
      services: ["Haircut"],
      date: "2025-08-01",
      timeSlot: "11:00 AM - 12:00 PM"
    });
    alert("Booked!");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Your Dashboard</h1>
      <button onClick={handleBooking} className="bg-[#8D6E63] text-white px-4 py-2 rounded mt-3">
        Book Sample Slot
      </button>
      <div className="mt-4">
        <h2 className="font-semibold">Booked slots:</h2>
        <pre>{JSON.stringify(slots, null, 2)}</pre>
      </div>
    </div>
  );
};

export default Dashboard;
