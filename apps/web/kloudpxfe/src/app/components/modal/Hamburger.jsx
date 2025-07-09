"use client";

import React, { useEffect } from "react";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import useModal from "@/app/hooks/useModal";

const Hamburger = () => {
  const { isOpen, setIsOpen, modalRef } = useModal();
  const { user } = useAuth();
  const { category, getItemsByCategory, getCategory } = useProductContext();
  const router = useRouter();

  const handleCategoryClick = async (id) => {
    await getItemsByCategory(id);
    setIsOpen(false);
    router.push(`/Products?category=${id}`);
  };

  useEffect(() => {
    getCategory();
  }, []);

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
            ref={modalRef}
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
                {category.map((item, index) => (
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