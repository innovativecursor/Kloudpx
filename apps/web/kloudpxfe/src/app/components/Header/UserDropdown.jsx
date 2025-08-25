"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { VscAccount } from "react-icons/vsc";
import {
  FaEdit,
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaHistory,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCartContext } from "@/app/contexts/CartContext";
import useModal from "@/app/hooks/useModal";
import { usePrescriptionContext } from "@/app/contexts/PrescriptionContext";
import usePageLoader from "@/app/hooks/usePageLoader";

const UserDropdown = () => {
  const router = useRouter();
  const { isOpen, setIsOpen, modalRef } = useModal();
  const [activeItem, setActiveItem] = useState(null);
  const { user, setToken, setUser } = useAuth();
  const { clearCart } = useCartContext();
  const { clearPrescription } = usePrescriptionContext();
  const { startLoader } = usePageLoader();

  const logout = () => {
    localStorage.removeItem("access_token");
    router.push("/");
    setToken(null);
    setUser(null);
    clearCart();
    clearPrescription();
  };

  const goToProfile = (tab) => {
    startLoader("/Profile");
    router.push(`/Profile?tab=${tab}`);
    setIsOpen(false);
  };

  const getBgColor = (item) => {
    switch (item) {
      case "edit":
        return activeItem === "edit" ? "bg-blue-100" : "";
      case "prescription":
        return activeItem === "prescription" ? "bg-green-100" : "";
      case "pwd":
        return activeItem === "pwd" ? "bg-purple-100" : "";
      case "history":
        return activeItem === "history" ? "bg-orange-100" : "";
      case "logout":
        return activeItem === "logout" ? "bg-red-100" : "";
      default:
        return "";
    }
  };

  return (
    <div className="relative flex items-center flex-col" ref={modalRef}>
      {/* Trigger */}
      <div
        className="cursor-pointer flex items-center flex-col"
        onClick={() => setIsOpen(!isOpen)}
      >
        <VscAccount className="md:text-2xl text-xl cursor-pointer text-gray-600" />
        <span className="md:text-sm sm:text-xs text-[10px] mt-1 tracking-wide opacity-70 truncate max-w-[60px] sm:max-w-[70px] text-center">
          {user?.first_name || user?.last_name
            ? `${user?.first_name || ""} ${user?.last_name || ""}`
            : "Hi, User"}
        </span>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 sm:w-80 w-64 xs:w-56 mt-5 bg-[#EDF4F6] shadow-lg rounded-lg border border-gray-200 z-[999]">
          {/* User Info */}
          <div className="flex px-4 sm:px-6 py-3 bg-[#CAEAFF]/80 rounded-t-lg justify-start gap-3 items-center">
            <VscAccount className="text-3xl sm:text-4xl flex-shrink-0 text-gray-600" />
            <div className="flex flex-col items-start overflow-hidden">
              <span className="truncate w-full text-sm sm:text-base font-medium">
                {user?.first_name} {user?.last_name}
              </span>
              <h1 className="truncate font-light text-xs sm:text-sm w-full">
                {user?.email}
              </h1>
            </div>
          </div>

          {/* Menu Items */}
          <div
            className={`px-4 sm:px-6 py-3 cursor-pointer flex border-b border-gray-200 justify-start gap-3 items-center ${getBgColor(
              "edit"
            )}`}
            onClick={() => {
              setActiveItem("edit");
              goToProfile("edit");
            }}
          >
            <FaEdit className="text-base sm:text-lg flex-shrink-0 text-gray-600" />
            <p className="truncate w-full text-sm sm:text-base font-normal">
              Edit Profile
            </p>
          </div>

          <div
            className={`px-4 sm:px-6 py-3 cursor-pointer flex border-b border-gray-200 justify-start gap-3 items-center ${getBgColor(
              "prescription"
            )}`}
            onClick={() => {
              setActiveItem("prescription");
              goToProfile("prescription");
            }}
          >
            <FaPrescriptionBottleAlt className="text-base sm:text-lg flex-shrink-0 text-gray-600" />
            <p className="truncate w-full text-sm sm:text-base font-normal">
              Prescription
            </p>
          </div>

          <div
            className={`px-4 sm:px-6 py-3 cursor-pointer flex border-b border-gray-200 justify-start gap-3 items-center ${getBgColor(
              "pwd"
            )}`}
            onClick={() => {
              setActiveItem("pwd");
              goToProfile("pwd");
            }}
          >
            <FaFileMedical className="text-base sm:text-lg flex-shrink-0 text-gray-600" />
            <p className="truncate w-full text-sm sm:text-base font-normal">
              PWD
            </p>
          </div>

          <div
            className={`px-4 sm:px-6 py-3 cursor-pointer flex border-b border-gray-200 justify-start gap-3 items-center ${getBgColor(
              "history"
            )}`}
            onClick={() => {
              setActiveItem("history");
              goToProfile("history");
            }}
          >
            <FaHistory className="text-base sm:text-lg flex-shrink-0 text-gray-600" />
            <p className="truncate w-full text-sm sm:text-base font-normal">
              Order History
            </p>
          </div>

          {/* Logout */}
          <div
            className={`px-4 sm:px-6 py-3 cursor-pointer flex border-b border-gray-200 justify-start gap-3 items-center rounded-b-lg ${getBgColor(
              "logout"
            )}`}
            onClick={() => {
              setActiveItem("logout");
              logout();
              setIsOpen(false);
            }}
          >
            <FaSignOutAlt className="text-base sm:text-lg flex-shrink-0 text-gray-600" />
            <p className="truncate w-full text-sm sm:text-base font-normal text-red-600">
              Logout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
