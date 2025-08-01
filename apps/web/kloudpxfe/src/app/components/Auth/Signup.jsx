"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsFacebook } from "react-icons/bs";

const Signup = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("phone");

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full sm:max-w-lg sm:mx-0 mx-3 sm:py-8 py-6 sm:px-20 px-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {/* <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-black text-xl"
        >
          &times;
        </button> */}

        <h2 className="sm:text-2xl text-xl font-bold text-center sm:mb-6 mb-3">
          Sign up
        </h2>

        {/* Tabs */}
        <div className="flex border-b sm:text-sm text-xs border-gray-100 mb-5">
          <button
            onClick={() => setActiveTab("phone")}
            className={`w-1/2 cursor-pointer  text-center py-2 font-medium ${
              activeTab === "phone"
                ? "text-[#0070ba] border-b border-[#0070ba]"
                : "text-gray-500"
            }`}
          >
            Phone
          </button>
          <button
            onClick={() => setActiveTab("email")}
            className={`w-1/2 cursor-pointer text-center py-2 font-medium ${
              activeTab === "email"
                ? "text-[#0070ba] border-b border-[#0070ba]"
                : "text-gray-500"
            }`}
          >
            Email
          </button>
        </div>

        {/* Form */}
        <form className="space-y-4 sm:pt-5 pt-3">
          <div className="border  border-gray-300  rounded-md">
            <div className="py-2 px-4 border-b border-gray-200 focus-within:border focus-within:border-[#0070ba] focus-within:rounded-md">
              <label className="text-[10px] text-gray-500">FIRST NAME</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full placeholder:text-xs text-base outline-none"
              />
            </div>

            {activeTab === "phone" ? (
              <div className="py-2 px-4 border-b border-gray-200 focus-within:border focus-within:border-[#0070ba] focus-within:rounded-md">
                <label className="text-[10px] text-gray-500">Phone</label>
                <input
                  type="tel"
                  placeholder="+63 | 6666666666"
                  className="w-full placeholder:text-xs text-base outline-none"
                />
              </div>
            ) : (
              <div className="py-2 px-4 border-b border-gray-200 focus-within:border focus-within:border-[#0070ba] focus-within:rounded-md">
                <label className="text-[10px] text-gray-500">Email</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className="w-full placeholder:text-xs text-base outline-none"
                />
              </div>
            )}

            <div className="py-2 px-4 border-b border-gray-200 focus-within:border focus-within:border-[#0070ba] focus-within:rounded-md">
              <label className="text-[10px] text-gray-500">PASSWORD</label>
              <input
                type="password"
                placeholder="********"
                className="w-full placeholder:text-xs text-base outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ">
            <input type="checkbox" className="" />
            <div className="text-[9px] underline opacity-60">
              I agree to the Terms of Service and Privacy Policy
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0070ba] cursor-pointer text-white sm:py-4 py-2 sm:text-sm text-[10px] rounded-full font-semibold"
          >
            CREATE AN ACCOUNT
          </button>

          <div className="text-center sm:text-xs text-[10px]">
            Already have an account?{" "}
            <span className="text-[#0070ba] underline cursor-pointer">
              LOGIN
            </span>
          </div>

          <div className="flex items-center sm:my-2 my-0">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-2 sm:text-sm text-xs text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <div className="flex justify-center gap-4">
            <button className="p-2 border border-gray-200 cursor-pointer rounded-md">
              <FcGoogle className="sm:text-2xl text-xl" />
            </button>
            <button className="p-2 border border-gray-200 cursor-pointer rounded-md">
              <BsFacebook className="text-blue-600 sm:text-2xl text-xl" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
