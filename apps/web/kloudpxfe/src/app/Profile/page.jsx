"use client";
import React from "react";
import { FaEdit } from "react-icons/fa";
import { FaPrescriptionBottleAlt } from "react-icons/fa";
import { FaQuestionCircle } from "react-icons/fa";
import { FaFileMedical } from "react-icons/fa";
import { FaHistory } from "react-icons/fa";
import Image from "next/image";
import SubTitle from "../components/Titles/SubTitle";

const ProfilePage = () => {
  const fallbackImage = "/assets/fallback.png";
  return (
    <div className="mt-40 md:mt-64 sm:mt-48 responsive-mx flex justify-start gap-10 items-start">
      <div>
        {/* Sidebar */}
        <SubTitle paths={["Home", "Profile"]} />
        <aside className="w-64 bg-blue-50/50 p-6 mt-5 ">
          <nav className="space-y-1">
            <button className="flex items-center w-full text-sm text-left p-2 rounded transition-all duration-300 hover:bg-[#0070ba] hover:text-white font-normal">
              <FaEdit className="mr-2" /> Edit Profile
            </button>
            <button className="flex items-center w-full text-left text-sm  p-2 rounded transition-all duration-300 hover:bg-[#0070ba] hover:text-white font-normal">
              <FaPrescriptionBottleAlt className="mr-2" /> Prescription
            </button>
            <button className="flex items-center w-full text-left text-sm  p-2 rounded transition-all duration-300 hover:bg-[#0070ba] hover:text-white font-normal">
              <FaFileMedical className="mr-2" /> PWD
            </button>
            <button className="flex items-center w-full text-left text-sm  p-2 rounded transition-all duration-300 hover:bg-[#0070ba] hover:text-white font-normal">
              <FaQuestionCircle className="mr-2" /> FAQ
            </button>
            <button className="flex items-center w-full text-left text-sm  p-2 rounded transition-all duration-300 hover:bg-[#0070ba] hover:text-white font-normal">
              <FaHistory className="mr-2" /> Order History
            </button>
          </nav>
        </aside>
      </div>

      {/* Main Profile Content */}
      <main className="flex-1 ">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

        {/* User Avatar and Name */}
        <div className="flex items-start gap-4 mb-8">
          <Image
            src={fallbackImage} // Replace with actual user image path
            alt="Profile"
            width={70}
            height={70}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-base font-semibold">Lidiya Sharin</h2>
            <button className="text-xs text-blue-600 font-medium hover:underline">
              Edit Profile Picture
            </button>
          </div>
        </div>

        {/* Profile Form Box */}
        <div className="bg-blue-50/20 p-8 rounded-xl shadow-sm max-w-3xl space-y-6">
          <h2 className="text-xl font-semibold mb-4">My Profile</h2>

          <div className="space-y-10 my-8 ">
            <div>
              <label className="block text-xs dark-text mb-1">
                Full Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value=""
                placeholder="name"
                className="w-full border-2 px-4 py-2 outline-none  mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
              />
            </div>

            <div>
              <label className="block text-xs dark-text mb-1">Phone</label>
              <div className="flex items-center border border-gray-100 rounded-md overflow-hidden ">
                <span className="bg-white px-4 py-2 text-sm">🇺🇸</span>
                <input
                  type="text"
                  value=""
                  className="w-full border-2 px-4 py-2 outline-none mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs dark-text mb-1">
                E-mail Id<span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value=""
                className="w-full border-2 px-4 py-2 outline-none  mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs dark-text mb-1">
                  Age<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value="26"
                  className="w-full border-2 px-4 py-2 outline-none  mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
                />
              </div>

              <div>
                <label className="block text-xs dark-text mb-1">
                  Gender<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value="Male"
                  className="w-full border-2 px-4 py-2 outline-none  mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
