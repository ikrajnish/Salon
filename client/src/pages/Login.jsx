import React, { useState, useRef } from "react";
import { auth } from "../firebase.config";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { doc, getDoc, getFirestore } from "firebase/firestore";

const db = getFirestore();

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const otpRefs = useRef([]);
  const navigate = useNavigate();

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
    return window.recaptchaVerifier;
  };

  const handleSendOTP = async () => {
    if (!phone.startsWith("+")) {
      setError("Include country code eg +91…");
      setSuccessMsg("");
      return;
    }

    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const appVerifier = setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmation(result);
      setOtpSent(true);
      setSuccessMsg("OTP sent successfully!");

      // ✅ Handle Firebase test phone number autofill
      if (phone === "+917250186824") {
        const testCode = "123456";
        setOtp(testCode.split(""));

        // Optional: auto-submit the OTP after slight delay
        setTimeout(() => {
          handleVerifyOTP();
        }, 800);
      }
    } catch {
      setError("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (val, idx) => {
    const arr = [...otp];
    arr[idx] = val;
    setOtp(arr);

    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleVerifyOTP = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Enter 6-digit OTP.");
      return;
    }

    setVerifyLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const result = await confirmation.confirm(code);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      let role = "user";
      let profileNeeded = false;

      if (!userSnap.exists()) {
        profileNeeded = true;
        await API.post("/auth/signup", { phone: user.phoneNumber });
      } else {
        const info = (await API.post("/auth/signup", { phone: user.phoneNumber })).data.user;
        role = info.isAdmin ? "admin" : "user";
      }

      setSuccessMsg("Verified successfully!");
      setTimeout(() => {
        navigate(profileNeeded ? "/profile" : role === "admin" ? "/admin" : "/dashboard");
      }, 1000);
    } catch {
      setError("Incorrect OTP.");
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5ECE3] p-4">
      <div className="bg-white rounded shadow p-6 w-full max-w-sm relative">
        {successMsg && (
          <div className="absolute -top-0 left-0 w-full bg-green-600 text-white p-2 text-center">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="absolute -top-0 left-0 w-full bg-[#5D4037] text-white p-2 text-center">
            {error}
          </div>
        )}
        <div className={`${successMsg || error ? "mt-10" : ""}`}>
          <h2 className="text-center text-[#5D4037] font-semibold mb-4">Login with Phone</h2>

          {!otpSent ? (
            <>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91..."
                className="w-full border p-2 rounded mb-3"
              />
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-[#8D6E63] text-white py-2 rounded flex justify-center"
              >
                {loading ? (
                  <span className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          ) : (
            <>
              <div className="flex space-x-2 mb-3">
                {otp.map((v, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    value={v}
                    onChange={(e) => handleOTPChange(e.target.value.slice(-1), i)}
                    maxLength={1}
                    className="w-10 h-12 text-center border rounded"
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={verifyLoading}
                className="w-full bg-[#8D6E63] text-white py-2 rounded flex justify-center"
              >
                {verifyLoading ? (
                  <span className="border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
                ) : (
                  "Verify OTP"
                )}
              </button>
            </>
          )}
        </div>
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default Login;
