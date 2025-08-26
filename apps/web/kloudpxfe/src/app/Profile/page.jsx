"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SubTitle from "../components/Titles/SubTitle";
import { useAuth } from "../contexts/AuthContext";
import UserMenu from "../components/Profile/UserMenu";
import EditProfile from "../components/Profile/EditProfile";
import PrescriptionHistoty from "../components/Profile/PrescriptionHistoty";

import { FaPaperclip } from "react-icons/fa";
import { useCartContext } from "../contexts/CartContext";
import usePageLoader from "../hooks/usePageLoader";
import { usePrescriptionContext } from "../contexts/PrescriptionContext";
import OrderHistory from "../components/Profile/OrderHistory";

const ProfilePage = () => {
  const fallbackImage = "/assets/fallback.png";
  const { user, setToken, setUser } = useAuth();
  const { startLoader } = usePageLoader();
  const { clearCart } = useCartContext();
  const [activeTab, setActiveTab] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearPrescription } = usePrescriptionContext();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const logout = () => {
    localStorage.removeItem("access_token");
    startLoader();
    router.push("/");
    setToken(null);
    setUser(null);
    clearCart();
    clearPrescription();
  };

  return (
    <div className="mt-40 md:mt-64 sm:mt-48 mb-24 responsive-mx flex md:flex-row flex-col justify-start gap-10 items-start">
      <div className="md:w-64 w-full">
        {/* Sidebar */}
        <SubTitle paths={["Home", "Profile"]} />
        <UserMenu setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>

      <main className="flex-1 w-full">
        <div
          className={`
            flex items-start gap-4 sm:mb-8 mb-4
            ${""}
            ${activeTab === "account" ? "block" : "hidden"} 
            md:flex
          `}
        >
          <div className="w-full">
            <h1 className="text-2xl md:text-start text-center font-semibold mb-6">
              My Profile
            </h1>
            <div className="flex justify-center md:justify-start gap-5 sm:mt-8">
              <img
                src={fallbackImage}
                alt="Profile"
                className="rounded-full object-cover sm:w-16 sm:h-16 w-12 h-12"
              />
              <div>
                <h2 className="text-base font-semibold">
                  {user?.first_name} {user?.last_name}
                </h2>
                <h2 className="text-sm mt-1 font-medium">{user?.email}</h2>
                {user?.age > 0 && (
                  <h2 className="text-sm mt-1 font-medium">{user.age}s old</h2>
                )}

                <h2 className="text-sm mt-1 font-medium">{user?.phone}</h2>

                <button
                  onClick={logout}
                  className="mt-3 text-base cursor-pointer !text-red-600 hover:underline"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {activeTab === "edit" && <EditProfile />}
        {activeTab === "prescription" && <PrescriptionHistoty />}
        {activeTab === "pwd" && (
          <div className="flex justify-between md:items-end items-center bg-blue-50/20 md:p-8 rounded-xl md:max-w-3xl w-full md:gap-0 gap-10 space-y-6">
            <h2 className="md:text-xl text-xs font-semibold mb-4">
              PWD Certificate
            </h2>
            <label
              htmlFor="upload"
              className="bg-[#0070BA] md:w-[50%] hover:bg-[#005c96] cursor-pointer text-white flex items-center justify-center gap-2 
                       md:text-sm text-[8px] lg:py-3 md:py-2 py-1.5 px-5 rounded-full  mb-4 "
            >
              <FaPaperclip className="text-xs" />
              <span className="lg:text-xs text-[11px]">
                Upload Pwd Certificate
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
