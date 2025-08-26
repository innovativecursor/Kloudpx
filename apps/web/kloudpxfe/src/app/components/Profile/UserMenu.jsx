"use client";
import React from "react";
import {
  FaEdit,
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaQuestionCircle,
  FaHistory,
  FaUserCircle,
} from "react-icons/fa";

const UserMenu = ({ setActiveTab, activeTab }) => {
  const getButtonClass = (tabName) => {
    const baseClasses =
      "menu-button flex items-center px-3 py-2 rounded-md cursor-pointer";
    const activeClasses = "bg-[#0070ba] text-white";

    const inactiveClasses = "hover:bg-blue-600 ";
    return tabName === activeTab
      ? `${baseClasses} ${activeClasses}`
      : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <aside className="bg-blue-50/50 p-3 mt-5 rounded-md">
      <nav className="grid grid-cols-2  gap-3 cursor-pointer md:block md:space-y-3">
        <button
          onClick={() => setActiveTab("edit")}
          className={getButtonClass("edit")}
        >
          <FaEdit className="mr-2" /> Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("prescription")}
          className={getButtonClass("prescription")}
        >
          <FaPrescriptionBottleAlt className="mr-2" /> Prescription
        </button>
        <button
          onClick={() => setActiveTab("pwd")}
          className={getButtonClass("pwd")}
        >
          <FaFileMedical className="mr-2" /> PWD
        </button>
        <button
          onClick={() => setActiveTab("order")}
          className={getButtonClass("order")}
        >
          <FaHistory className="mr-2" /> Order History
        </button>


        <button
          onClick={() => setActiveTab("account")}
          className={`${getButtonClass("account")} md:hidden`}
        >
          <FaUserCircle className="mr-2" /> Account
        </button>
      </nav>
    </aside>
  );
};

export default UserMenu;
