import React, { useEffect, useState } from "react";
import API from "../api/axios";

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSavings: 0,
    avgSavings: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/bookings/my");
      const bookings = res.data || [];

      let totalSavings = 0;
      bookings.forEach(b => {
        if (b.amount && b.finalAmount) {
          totalSavings += b.amount - b.finalAmount;
        }
      });

      const totalBookings = bookings.length;
      const avgSavings = totalBookings ? totalSavings / totalBookings : 0;

      setStats({
        totalBookings,
        totalSavings: Math.round(totalSavings),
        avgSavings: Math.round(avgSavings),
      });
    } catch (err) {
      console.error("Stats fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="grid md:grid-cols-3 gap-4 mb-6 p-2 animate-pulse">
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
        <div className="h-20 bg-gray-200 rounded-xl"></div>
      </div>
    );

  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6 p-2">
      <div className="p-4 bg-white rounded-xl shadow text-center">
        <p className="text-gray-500 text-sm">Total Bookings</p>
        <p className="text-xl font-bold">{stats.totalBookings}</p>
      </div>

      <div className="p-4 bg-white rounded-xl shadow text-center">
        <p className="text-gray-500 text-sm">Total Savings</p>
        <p className="text-xl font-bold text-green-600">₹{stats.totalSavings}</p>
      </div>

      <div className="p-4 bg-white rounded-xl shadow text-center">
        <p className="text-gray-500 text-sm">Avg Savings</p>
        <p className="text-xl font-bold text-blue-600">₹{stats.avgSavings}</p>
      </div>
    </div>
  );
};

export default StatsSection;
