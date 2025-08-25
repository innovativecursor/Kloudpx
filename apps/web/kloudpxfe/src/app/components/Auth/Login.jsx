"use client";

import React from "react";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";
import { useLoginAuth } from "@/app/contexts/LoginAuth";
import { useAuth } from "@/app/contexts/AuthContext";

const Login = () => {
  const {
    isLoginOpen,
    closeLogin,
    formData,
    handleChange,
    loading,
    loginOtpSent,
    handleLoginSendOtp,
    handleLoginVerifyOtp,
    countryCodes,
    openSignup,
  } = useLoginAuth();
  const { googleLogin } = useAuth();
  if (!isLoginOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]"
      onClick={closeLogin}
    >
      <div
        className="bg-white rounded-2xl w-full sm:max-w-md sm:mx-0 mx-3 sm:py-8 py-6 sm:px-14 px-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="sm:text-2xl text-xl font-bold text-center sm:mb-4 mb-2">
          Log In
        </h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="border border-gray-300 rounded-md">
            <div className="py-2 px-4 flex gap-2">
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
                className="w-full rounded-r-md outline-none placeholder:text-xs"
              />
            </div>
          </div>

          {/* OTP input */}
          {loginOtpSent && (
            <div className="border border-gray-300 rounded-md">
              <div className="py-2 px-4">
                <label className="text-[10px] text-gray-500">OTP</label>
                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full text-base outline-none placeholder:text-xs"
                />
              </div>
            </div>
          )}

          {/* Button */}
          <button
            type="button"
            onSubmit={(e) => e.preventDefault()}
            onClick={(e) =>
              loginOtpSent ? handleLoginVerifyOtp(e) : handleLoginSendOtp(e)
            }
            disabled={loading}
            className="w-full bg-[#0070ba] text-white sm:py-4 py-2 sm:text-sm text-[10px] rounded-full font-semibold"
          >
            {loading
              ? loginOtpSent
                ? "Verifying..."
                : "Sending..."
              : loginOtpSent
              ? "Verify OTP"
              : "Send OTP"}
          </button>

          <div className="text-center sm:text-xs text-[10px]">
            Don’t have an account?{" "}
            <span
              className="text-[#0070ba] underline cursor-pointer"
              onClick={() => {
                closeLogin();
                openSignup();
              }}
            >
              SIGN UP
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
                  closeLogin();
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

export default Login;
