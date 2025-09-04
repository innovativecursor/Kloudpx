"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrescriptionContext } from "../contexts/PrescriptionContext";
import { useAuth } from "../contexts/AuthContext";
import usePageLoader from "../hooks/usePageLoader";
import { useCartContext } from "../contexts/CartContext";
import SubTitle from "../components/Titles/SubTitle";
import UserMenu from "../components/Profile/UserMenu";
import EditProfile from "../components/Profile/EditProfile";
import PrescriptionHistoty from "../components/Profile/PrescriptionHistoty";
import OrderHistory from "../components/Profile/OrderHistory";
import Pwd from "../components/Profile/Pwd";
import SeniorCitizen from "../components/Profile/SeniorCitizen";

const Page = () => {
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
    sessionStorage.removeItem("selectedaddressId");
    startLoader();
    router.push("/");
    setToken(null);
    setUser(null);
    clearCart();
    clearPrescription();
  };

  return (
    <div className="demo-page mt-40 md:mt-64 sm:mt-48 mb-24 responsive-mx flex md:flex-row flex-col justify-start gap-10 items-start not-prose">
      <div className="md:w-64 w-full">
        {/* Sidebar */}
        <SubTitle paths={["Home", "Profile"]} />
        <UserMenu setActiveTab={setActiveTab} activeTab={activeTab} />
      </div>
      <main className="flex-1 w-full">
        <div
          className={`flex flex-col md:flex-row items-start gap-6 sm:mb-8 mb-6 ${
            activeTab === "account" ? "block" : "hidden"
          }`}
        >
          <div className="w-full bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 text-center md:text-left">
              My Profile
            </h1>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-5">
              <img
                src={fallbackImage}
                alt="Profile"
                className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover border-2 border-gray-200"
              />

              <div className="text-center md:text-left">
                <h2 className="text-lg font-semibold text-gray-800">
                  {user?.first_name} {user?.last_name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                {user?.age > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {user.age} {user.age === 1 ? "year" : "years"} old
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">{user?.phone}</p>

                <button
                  onClick={logout}
                  className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 hover:underline transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {activeTab === "edit" && <EditProfile />}
        {activeTab === "prescription" && <PrescriptionHistoty />}
        {activeTab === "pwd" && <Pwd />}
        {activeTab === "seniorcitizen" && <SeniorCitizen />}
        {activeTab === "order" && <OrderHistory />}
      </main>
    </div>
  );
};

export default Page;
