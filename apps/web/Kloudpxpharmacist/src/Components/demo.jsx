

"use client";
import React, { useState } from "react";
import axios from "axios";
import endpoints from "@/app/config/endpoints";


const Signup = () => {
  const [step, setStep] = useState("signup"); 
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+91",
    phone: "",
    otp: "",
  });

  // Input handle
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send OTP
  const handleSendOtp = async () => {
    try {
      if (!formData.phone) {
        alert("Please enter phone number");
        return;
      }

      setLoading(true);
      await axios.post(endpoints.basicauthphone.signup, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: `${formData.countryCode}${formData.phone}`,
      });

      setStep("verify");
      alert("OTP sent successfully!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      if (!formData.otp) {
        alert("Please enter OTP");
        return;
      }

      setLoading(true);
      await axios.post(endpoints.basicauthphone.signupverify, {
        phone: `${formData.countryCode}${formData.phone}`,
        otp: formData.otp,
      });

      alert("Signup successful!");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-6">
          {step === "signup" ? "Create Account" : "Verify OTP"}
        </h2>

        {step === "signup" ? (
          <div className="space-y-4">
            {/* First Name */}
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            {/* Last Name */}
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            {/* Phone with Country Code */}
            <div className="flex">
              <input
                type="text"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="w-20 border p-3 rounded-l-lg"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border p-3 rounded-r-lg"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Phone (Read Only) */}
            <div className="flex">
              <input
                type="text"
                value={formData.countryCode}
                readOnly
                className="w-20 border p-3 rounded-l-lg bg-gray-100"
              />
              <input
                type="text"
                value={formData.phone}
                readOnly
                className="w-full border p-3 rounded-r-lg bg-gray-100"
              />
            </div>

            {/* OTP */}
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
