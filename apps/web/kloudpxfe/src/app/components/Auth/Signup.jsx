"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { useLoginAuth } from "@/app/contexts/LoginAuth";
import { useAuth } from "@/app/contexts/AuthContext";

const Signup = ({ isOpen, onClose }) => {
  const {
    step,
    loading,
    formData,
    countryCodes,
    handleChange,
    handleSendOtp,
    handleVerifyOtp,
    openLogin,
  } = useLoginAuth();
  const { googleLogin } = useAuth();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-white cursor-pointer rounded-2xl w-full sm:max-w-lg sm:mx-0 mx-3 sm:py-8 py-6 sm:px-20 px-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="sm:text-2xl text-xl font-bold text-center mb-4">
          {step === "signup" ? "Create Account" : "Verify OTP"}
        </h2>

        <form className="space-y-4">
          {step === "signup" ? (
            <>
              <div className="border border-gray-300 rounded-md">
                <div className="py-2 px-4 border-b border-gray-200 focus-within:border focus-within:border-[#0070ba] focus-within:rounded-md">
                  <label className="text-[10px] text-gray-500">
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Your first name"
                    value={formData.firstName}
                    required
                    onChange={handleChange}
                    className="w-full placeholder:text-xs text-base outline-none"
                  />
                </div>
                <div className="py-2 px-4 border-b border-gray-200 focus-within:border focus-within:border-[#0070ba] focus-within:rounded-md">
                  <label className="text-[10px] text-gray-500">LAST NAME</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Your last name"
                    value={formData.lastName}
                    required
                    onChange={handleChange}
                    className="w-full placeholder:text-xs text-base outline-none"
                  />
                </div>
                <div className="py-2 px-4 border-b border-gray-200 focus-within:border focus-within:border-[#0070ba] focus-within:rounded-md">
                  <label className="text-[10px] text-gray-500">EMAIL</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email"
                    value={formData.email}
                    required
                    onChange={handleChange}
                    className="w-full placeholder:text-xs text-base outline-none"
                  />
                </div>

                <div className="py-2 px-4 border-b border-gray-200 focus-within:border focus-within:border-[#0070ba] focus-within:rounded-md">
                  <label className="text-[10px] text-gray-500">PHONE</label>
                  <div className="flex">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className="w-20 text-xs rounded-l-md outline-none"
                    >
                      {countryCodes.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full  rounded-r-md outline-none placeholder:text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex cursor-pointer items-center gap-2 mt-1">
                <input type="checkbox" />
                <div className="text-[9px] underline opacity-60">
                  I agree to the Terms of Service and Privacy Policy
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full bg-[#0070ba] cursor-pointer text-white sm:py-4 py-2 sm:text-sm text-[10px] rounded-full font-semibold"
              >
                {loading ? "Sending..." : "CREATE AN ACCOUNT"}
              </button>
            </>
          ) : (
            <>
              {/* Verify OTP Section */}
              <div className="border border-gray-300 rounded-md overflow-hidden">
                {/* Phone Display */}
                <div className="flex border-b border-gray-200">
                  <input
                    type="text"
                    value={formData.countryCode}
                    readOnly
                    className="w-20 text-xs text-gray-700 bg-gray-100 px-3 py-2 rounded-l-md outline-none"
                  />
                  <input
                    type="text"
                    value={formData.phone}
                    readOnly
                    className="flex-1 text-xs text-gray-700 bg-gray-100 px-3 py-2 rounded-r-md outline-none placeholder:text-xs"
                  />
                </div>

                {/* OTP Input */}
                <div className="px-3 py-3">
                  <label className="block text-[10px] text-gray-500 mb-1">
                    OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={formData.otp}
                    required
                    onChange={handleChange}
                    className="w-full text-sm placeholder:text-xs text-gray-800 px-3 py-2 border border-gray-200 rounded-md outline-none focus:border-[#0070ba] focus:ring-1 focus:ring-[#0070ba]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={loading}
                className="w-full bg-green-600 cursor-pointer text-white sm:py-4 py-2 sm:text-sm text-[10px] rounded-full font-semibold mt-3"
              >
                {loading ? "Verifying..." : "VERIFY OTP"}
              </button>
            </>
          )}

          <div className="text-center sm:text-xs text-[10px]">
            Already have an account?{" "}
            <span
              className="text-[#0070ba] underline cursor-pointer"
              onClick={() => {
                onClose();
                openLogin();
              }}
            >
              LOGIN
            </span>
          </div>

          <div className="flex items-center sm:my-2 my-0">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-2 sm:text-sm text-xs text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <div className="flex justify-center gap-4">
            {/* <button
              type="button"
              onClick={googleLogin}
              className="p-2 border border-gray-200 cursor-pointer rounded-md"
            >
              <FcGoogle className="sm:text-2xl text-xl" />
            </button> */}
            <button
              type="button"
              onClick={async () => {
                try {
                  await googleLogin();
                  onClose();
                } catch (err) {
                  console.error("Google login failed", err);
                }
              }}
              className="p-2 border border-gray-200 cursor-pointer rounded-md"
            >
              <FcGoogle className="sm:text-2xl text-xl" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
