import React, { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import QrScanner from "../components/QrScanner";

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({});
  const [scannedEmail, setScannedEmail] = useState("");
  const [scannedUser, setScannedUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(""); // ✅ manual user selection
  const [services, setServices] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [amount, setAmount] = useState("");
  const [finalAmount, setFinalAmount] = useState("");
  const [membershipType, setMembershipType] = useState("Silver");
  const [membershipDuration, setMembershipDuration] = useState(3);
  const [qrOpen, setQrOpen] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [remainingDays, setRemainingDays] = useState(null);

  const token = localStorage.getItem("token");
  const { setUser } = useAuth();
  const audioRef = useRef(null);
  const scanTimeoutRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/scan-success.mp3");
    audioRef.current.load();
  }, []);

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split("T")[0]);
    let hour = now.getHours();
    let minutes = now.getMinutes();
    minutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 0;
    if (minutes === 0 && now.getMinutes() >= 45) hour += 1;
    if (hour < 10) hour = 10;
    if (hour > 20) hour = 20;
    setTimeSlot(`${hour.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookRes, userRes] = await Promise.all([
        API.get("/bookings", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setBookings(bookRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setUsers(userRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const calculateRemainingDays = (expiresAt) => {
    if (!expiresAt) return 0;
    const diff = new Date(expiresAt) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleCreateBooking = async () => {
    if (!scannedEmail || !services || !date || !timeSlot || !amount || !finalAmount) return;
    try {
      await API.post(
        "/bookings",
        {
          userEmail: scannedEmail,
          services: services.split(",").map((s) => s.trim()),
          date,
          timeSlot,
          amount: parseFloat(amount),
          finalAmount: parseFloat(finalAmount),
          status: "pending",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScannedEmail("");
      setScannedUser(null);
      setServices("");
      setAmount("");
      setFinalAmount("");
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleFieldChange = (id, field, value) => {
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, [field]: value } : b)));
    setEditing((prev) => ({ ...prev, [id]: true }));
  };

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
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Manual Membership Upgrade via Dropdown
  const handleUpgradeMembership = async () => {
    if (!selectedUser) return alert("Select a user first!");
    try {
      const res = await API.put(
        `/admin/membership/${selectedUser}`,
        { type: membershipType, durationInMonths: membershipDuration },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data.membership;
      setRemainingDays(calculateRemainingDays(updated.expiresAt));

      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser?.uid === selectedUser) {
        const updatedUser = { ...currentUser, membership: updated };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }

      alert(res.data.msg);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to upgrade membership");
    }
  };

  // ✅ QR Scan now only verifies membership
  const handleQrScan = (result) => {
    if (!result) return;
    let email;
    try {
      const parsed = JSON.parse(result);
      email = parsed.email || result;
    } catch {
      email = result;
    }

    setScannedEmail(email);
    const user = users.find((u) => u.email === email);
    setScannedUser(user || null);

    if (user?.membership?.expiresAt) {
      setRemainingDays(calculateRemainingDays(user.membership.expiresAt));
    } else {
      setRemainingDays(0);
    }

    setScanSuccess(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }

    setQrOpen(false);
    if (scanTimeoutRef.current) clearTimeout(scanTimeoutRef.current);
    scanTimeoutRef.current = setTimeout(() => setScanSuccess(false), 1200);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
  <div className="p-4 bg-gradient-to-r from-blue-200 via-50% to-red-200 min-h-screen">
    <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>

    {/* Main Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Left Side */}
      <div className="space-y-6">

        {/* QR Verification Section */}
        <div className="border p-4 rounded shadow-sm relative w-full">
          <h2 className="font-semibold mb-3">Verify Membership (QR)</h2>

          <button
            onClick={() => setQrOpen(true)}
            className="bg-[#8D6E63] text-white px-4 py-2 rounded hover:bg-[#5D4037] w-full md:w-auto"
          >
            Open QR Scanner
          </button>

          {scanSuccess && (
            <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded animate-pulse">
              ✅ Verified!
            </div>
          )}

          {qrOpen && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
              <QrScanner onScan={handleQrScan} onClose={() => setQrOpen(false)} />
            </div>
          )}

          {scannedUser && (
            <div className="mt-4 border p-3 rounded bg-gray-50 space-y-1 text-sm">
              <p><strong>Email:</strong> {scannedUser.email}</p>
              <p><strong>Membership:</strong> {scannedUser.membership?.type || "None"} </p>
              <p><strong>Remaining:</strong> {remainingDays || 0} days</p>
            </div>
          )}
        </div>

        {/* Manual Membership Upgrade */}
        <div className="border p-4 rounded shadow-sm w-full">
          <h2 className="font-semibold mb-3">Upgrade Membership (Manual)</h2>

          <input
            list="users"
            className="border p-2 w-full rounded mb-2"
            placeholder="Select or type user"
            onChange={(e) => {
              const match = users.find(
                u => `${u.firstName} (${u.email})` === e.target.value
              );
              setSelectedUser(match?._id || "");
            }}
          />
          <datalist id="users">
            {users.map((u) => (
              <option key={u._id} value={`${u.firstName} (${u.email})`} />
            ))}
          </datalist>

          <select
            value={membershipType}
            onChange={(e) => setMembershipType(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          >
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>

          <select
            value={membershipDuration}
            onChange={(e) => setMembershipDuration(parseInt(e.target.value))}
            className="border p-2 rounded w-full mb-2"
          >
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
          </select>

          <button
            onClick={handleUpgradeMembership}
            className="bg-[#8D6E63] text-white px-3 py-2 rounded hover:bg-[#5D4037] w-full"
          >
            Upgrade Membership
          </button>
        </div>

      </div>

      {/* Create Booking Section */}
      <div className="md:col-span-2 border p-4 rounded shadow-sm w-full">
        <h2 className="font-semibold mb-4 text-lg">Create Booking</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="email"
            placeholder="User Email"
            value={scannedEmail}
            onChange={(e) => setScannedEmail(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            placeholder="Services (comma separated)"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="time"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Final Amount"
            value={finalAmount}
            onChange={(e) => setFinalAmount(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <button
          onClick={handleCreateBooking}
          className="mt-3 bg-[#8D6E63] text-white px-4 py-2 rounded hover:bg-[#5D4037] w-full"
        >
          Create Booking
        </button>
      </div>
    </div>

    {/* Booking List */}
    <div className="mt-6 space-y-4">
      {bookings.map((b) => (
        <div
          key={b._id}
          className="border p-4 rounded shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4 w-full"
        >
          <div className="text-sm space-y-1 w-full">
            <p><strong>User:</strong> {b.user?.firstName || "N/A"}</p>
            <p><strong>Services:</strong> {b.services.join(", ")}</p>
            <p><strong>Date:</strong> {new Date(b.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {b.timeSlot}</p>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <input
              type="number"
              value={b.amount}
              onChange={(e) => handleFieldChange(b._id, "amount", e.target.value)}
              className="border p-1 rounded w-24"
            />
            <input
              type="number"
              value={b.finalAmount}
              onChange={(e) => handleFieldChange(b._id, "finalAmount", e.target.value)}
              className="border p-1 rounded w-24"
            />
            <select
              value={b.status}
              onChange={(e) => handleFieldChange(b._id, "status", e.target.value)}
              className="border p-1 rounded w-28"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {editing[b._id] && (
              <button
                onClick={() => handleUpdate(b._id)}
                className="bg-[#8D6E63] text-white px-3 py-1 rounded hover:bg-[#5D4037]"
              >
                Save
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

};

export default AdminPanel;
