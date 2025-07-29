"use client";
import React from "react";
import {
  FaEdit,
  FaPrescriptionBottleAlt,
  FaFileMedical,
  FaQuestionCircle,
  FaHistory,
} from "react-icons/fa";

const UserMenu = ({ setActiveTab }) => {
  return (
    <aside className="w-64 bg-blue-50/50 p-6 mt-5">
      <nav className="space-y-3 cursor-pointer">
        <button onClick={() => setActiveTab("edit")} className="menu-button">
          <FaEdit className="mr-2" /> Edit Profile
        </button>
        <button
          onClick={() => setActiveTab("prescription")}
          className="menu-button"
        >
          <FaPrescriptionBottleAlt className="mr-2" /> Prescription
        </button>
        <button onClick={() => setActiveTab("pwd")} className="menu-button">
          <FaFileMedical className="mr-2" /> PWD
        </button>

        <button onClick={() => setActiveTab("order")} className="menu-button">
          <FaHistory className="mr-2" /> Order History
        </button>
      </nav>
    </aside>
  );
};

export default UserMenu;
