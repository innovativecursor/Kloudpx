"use client";

import React, { useState, useRef, useEffect } from "react";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user } = useAuth();
  const { category, getItemsByCategory } = useProductContext();
  const router = useRouter();

  const handleCategoryClick = async (id) => {
    await getItemsByCategory(id);
    setIsOpen(false);
    router.push(`/Products?category=${id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-2xl cursor-pointer p-2 focus:outline-none"
        >
          <i className="ri-menu-2-fill"></i>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40"></div>

          <div
            ref={menuRef}
            className="fixed top-32 max-w-md bg-white rounded-sm z-50"
          >
            {/* User Info */}
            <div className="p-6">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div className="text-[10px] tracking-wider font-normal">
                  <p>
                    <span className="opacity-70">Welcome back,</span>{" "}
                    <span className="font-semibold text-[#0070BA]">
                      {user?.first_name}
                      {user?.last_name}
                    </span>
                  </p>
                  <p>{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Menu Items from API */}
            <div>
              <ul className="space-y-1 font-normal text-xs">
                {category?.data?.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => handleCategoryClick(item.ID)}
                    className="px-6 py-2 hover:bg-[#0070BA]/20 hover:font-medium transition-all cursor-pointer"
                  >
                    {item.CategoryName}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Hamburger;
