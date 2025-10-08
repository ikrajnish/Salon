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
    <div className="p-4 overflow-hidden">
      <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-6">
          {/* ✅ QR Verification Section */}
          <div className="border p-4 rounded shadow-sm relative min-h-[200px]">
            <h2 className="font-semibold mb-2">Verify Membership (QR)</h2>
            <button
              onClick={() => setQrOpen(true)}
              className="bg-[#8D6E63] text-white px-4 py-2 rounded hover:bg-[#5D4037]"
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
              <div className="mt-4 border p-2 rounded bg-gray-50">
                <p>
                  <strong>Email:</strong> {scannedUser.email}
                </p>
                <p>
                  <strong>Membership:</strong> {scannedUser.membership?.type || "None"} (
                  {scannedUser.membership?.durationInMonths || 0} months)
                </p>
                <p>
                  <strong>Remaining:</strong>{" "}
                  {remainingDays !== null ? `${remainingDays} days` : "N/A"}
                </p>
              </div>
            )}
          </div>

          {/* ✅ Manual Membership Upgrade Section */}
          <div className="border p-4 rounded shadow-sm">
            <h2 className="font-semibold mb-2">Upgrade Membership (Manual)</h2>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.firstName} ({u.email})
                </option>
              ))}
            </select>
            <select
              value={membershipType}
              onChange={(e) => setMembershipType(e.target.value)}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="Silver">Silver</option>
              <option value="SilverPlus">SilverPlus</option>
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

        {/* ✅ Existing Booking Section (unchanged) */}
        <div className="md:w-2/3 border p-4 rounded shadow-sm">
          <h2 className="font-semibold mb-2 text-lg">Create Booking</h2>
          <input
            type="email"
            placeholder="User Email"
            value={scannedEmail}
            onChange={(e) => setScannedEmail(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="text"
            placeholder="Services (comma separated)"
            value={services}
            onChange={(e) => setServices(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="time"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="number"
            placeholder="Final Amount"
            value={finalAmount}
            onChange={(e) => setFinalAmount(e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <button
            onClick={handleCreateBooking}
            className="bg-[#8D6E63] text-white px-4 py-2 rounded hover:bg-[#5D4037] w-full"
          >
            Create Booking
          </button>
        </div>
      </div>

      {/* ✅ Existing Booking List */}
      <div className="mt-6 space-y-3">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="border p-3 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <p>
                <strong>User:</strong> {b.user?.firstName || "N/A"}
              </p>
              <p>
                <strong>Services:</strong> {b.services.join(", ")}
              </p>
              <p>
                <strong>Date:</strong> {new Date(b.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {b.timeSlot}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={b.amount}
                onChange={(e) => handleFieldChange(b._id, "amount", e.target.value)}
                className="border p-1 rounded w-20"
              />
              <input
                type="number"
                value={b.finalAmount}
                onChange={(e) => handleFieldChange(b._id, "finalAmount", e.target.value)}
                className="border p-1 rounded w-20"
              />
              <select
                value={b.status}
                onChange={(e) => handleFieldChange(b._id, "status", e.target.value)}
                className="border p-1 rounded"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {editing[b._id] && (
                <button
                  onClick={() => handleUpdate(b._id)}
                  className="bg-[#8D6E63] text-white px-2 py-1 rounded hover:bg-[#5D4037]"
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
