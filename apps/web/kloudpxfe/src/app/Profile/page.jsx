"use client";
import React, { useState } from "react";
import Image from "next/image";
import SubTitle from "../components/Titles/SubTitle";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "../components/Profile/UserMenu";
import EditProfile from "../components/Profile/EditProfile";
import PrescriptionHistoty from "../components/Profile/PrescriptionHistoty";
import OrderHistory from "../components/Profile/OrderHistory";
import { FaPaperclip } from "react-icons/fa";

const ProfilePage = () => {
  const fallbackImage = "/assets/fallback.png";
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("");

  return (
    <div className="mt-40 md:mt-64 sm:mt-48 responsive-mx flex justify-start gap-10 items-start">
      <div className="">
        {/* Sidebar */}
        <SubTitle paths={["Home", "Profile"]} />
        <UserMenu setActiveTab={setActiveTab} />
      </div>

      {/* Main Content */}
      <main className="md:flex-1">
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>

        <div className="flex items-start gap-4 mb-8">
          <Image
            src={fallbackImage}
            alt="Profile"
            width={70}
            height={70}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-base font-semibold">
              {user?.first_name} {user?.last_name}
            </h2>
            <h2 className="text-sm mt-1 font-medium">{user?.email}</h2>
            <button className="text-xs text-blue-600 font-medium hover:underline">
              Edit Profile Picture
            </button>
          </div>
        </div>

        {activeTab === "edit" && <EditProfile />}
        {activeTab === "prescription" && <PrescriptionHistoty />}
        {activeTab === "pwd" && (
          <div className="flex justify-between items-end bg-blue-50/20 p-8 rounded-xl max-w-3xl space-y-6">
            <h2 className="text-xl font-semibold mb-4">PWD Certificate</h2>
            <label
              htmlFor="upload"
              className="bg-[#0070BA] w-[50%] hover:bg-[#005c96] cursor-pointer text-white flex items-center justify-center gap-2 
                             text-sm lg:py-3 py-2 px-5 rounded-full  mb-4"
            >
              <FaPaperclip className="text-xs" />
              <span className="lg:text-xs text-[11px]">
                Upload Gcash Payment
              </span>
              <input
                type="file"
                id="upload"
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>
        )}
        {activeTab === "order" && <OrderHistory />}
      </main>
    </div>
  );
};

export default ProfilePage;
