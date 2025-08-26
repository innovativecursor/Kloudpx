"use client";

import React, { useEffect } from "react";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useAuth } from "@/app/contexts/AuthContext";
import useModal from "@/app/hooks/useModal";
import useCategoryHandler from "@/app/hooks/useCategoryHandler";
import { VscAccount } from "react-icons/vsc";

const Hamburger = () => {
  const { isOpen, setIsOpen, modalRef } = useModal();
  const { user } = useAuth();
  const { category } = useProductContext();
  const { handleCategoryClick } = useCategoryHandler();

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xl cursor-pointer p-2 focus:outline-none"
        >
          <i className="ri-menu-2-fill"></i>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40"></div>

          <div
            ref={modalRef}
            className="fixed md:top-32 top-20 max-w-md bg-white max-h-96 overflow-y-scroll rounded-sm z-[99] thin-scrollbar"
          >
            {/* User Info */}
            <div className="pt-6 pb-3 px-6 ">
              <div className="flex items-center gap-3">
                        <VscAccount className="md:text-2xl mb-1 text-xl cursor-pointer" />
                <div className="text-[10px] tracking-wider font-normal">
                  <div>
                    <span className="opacity-70">Welcome back, </span>{" "}
                    <span className="font-semibold text-[#0070BA]">
                      {user?.first_name} {" "}
                      {user?.last_name}
                    </span>
                  </div>
                  <h1>{user?.email}</h1>
                </div>
              </div>
            </div>

            {/* Menu Items from API */}
            {category?.length > 0 ? (
              <div>
                <ul className="space-y-1 font-normal text-xs mb-5">
                  {category.map((item, index) => (
                    <li
                      key={index}
                      onClick={() =>
                        handleCategoryClick(item.ID, true, () =>
                          setIsOpen(false)
                        )
                      }
                      className="px-6 py-2 hover:bg-[#0070BA]/20 hover:font-medium transition-all cursor-pointer"
                    >
                      {/* {item.CategoryName} */}
                      {item.CategoryName.length > 20
                        ? item.CategoryName.slice(0, 20) + "..."
                        : item.CategoryName}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center text-gray-500  text-[9px] mb-20 mt-6">
                No Category Available at the Moment.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Hamburger;
