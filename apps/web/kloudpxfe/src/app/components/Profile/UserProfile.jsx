"use client";

import React from "react";
import useModal from "@/app/hooks/useModal";
import { useRouter } from "next/navigation";
import { VscAccount } from "react-icons/vsc";

const UserProfile = ({ user, logout }) => {
  const { isOpen, setIsOpen, modalRef } = useModal();
  const router = useRouter();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div
      className="relative font-semibold sm:text-xs text-xs cursor-pointer"
      ref={modalRef}
    >
      {/* Username button */}
      <button
        onClick={toggleDropdown}
        className="focus:outline-none cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {/* {`Hi, ${user.first_name} ${user.last_name}`} */}
        <VscAccount className="md:text-3xl text-2xl" />
      </button>

      {/* Dropdown Modal */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <ul className="flex flex-col">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                // router.push("/account");
                setIsOpen(false);
              }}
            >
              Account
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
