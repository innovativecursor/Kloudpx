"use client";

import React, { useEffect, useState } from "react";
import Logo from "@/app/components/logo/Logo";
import SearchBar from "@/app/components/searchbar/SearchBar";
import TopItems from "@/app/components/topitems/TopItems";
import Hamburger from "@/app/components/modal/Hamburger";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCartContext } from "@/app/contexts/CartContext";
import CartModal from "@/app/components/modal/CartModal";
import useModal from "@/app/hooks/useModal";
import { VscAccount } from "react-icons/vsc";
import { PiShoppingCartSimple } from "react-icons/pi";
import UserDropdown from "./UserDropdown";
import { useLoginAuth } from "@/app/contexts/LoginAuth";
import Signup from "../Auth/Signup";
import Login from "../Auth/Login";

const Header = () => {
  const { loading, user, isAuthLoaded } = useAuth();
  const {
    showSignup,
    openSignup,
    closeSignup,
    isLoginOpen,

    closeLogin,
  } = useLoginAuth();
  const { cartLength } = useCartContext();
  const { isOpen, setIsOpen, modalRef } = useModal();

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
        <div className="responsive-mx md:mt-2 sm:mt-5 mt-3">
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-2">
              <div className="md:hidden block">
                <Hamburger />
              </div>
              <Logo />
            </div>

            {/* Center: Search Bar */}
            <div className="md:block hidden flex-grow px-4">
              <SearchBar />
            </div>

            {/* Right: User & Cart */}
            <div className="flex items-start sm:items-center justify-center sm:gap-6 gap-3 ">
              <div>
                {!isAuthLoaded ? null : !loading && user ? (
                  <div className="flex items-center flex-col">
                    <UserDropdown />
                  </div>
                ) : (
                  <div className="">
                    <button
                      className="md:text-sm flex items-center flex-col sm:text-xs text-[9px] mt-1 tracking-wide opacity-70 cursor-pointer"
                      onClick={openSignup}
                    >
                      <VscAccount className="md:text-2xl mb-1 text-xl cursor-pointer" />
                      Signup/Login
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Icon with Hover */}
              <div
                className="relative cursor-pointer"
                onClick={() => setIsOpen(true)}
              >
                <PiShoppingCartSimple className="md:text-2xl text-xl cursor-pointer" />
                <span className="md:text-sm sm:text-xs text-[9px] mt-1 tracking-wide opacity-70 cursor-pointer">
                  Cart
                </span>
                <span
                  className="absolute sm:-top-1 top-0 sm:right-1 -right-1 sm:text-[10px] text-[9px] bg-red-600 text-white rounded-full
                 sm:w-4 sm:h-4 h-3 w-3 flex items-center justify-center"
                >
                  {isAuthLoaded ? cartLength : 0}
                </span>

                {/* Cart Modal */}
                <CartModal
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  modalRef={modalRef}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden block mx-3 pt-3 pb-4">
          <SearchBar />
        </div>

        {/* Bottom Row: Hamburger + TopItems */}
        <div className="mt-5 md:block hidden">
          <div className="flex-between-center border-t border-b border-gray-200">
            <div className="w-full px-3 md:px-[8vw] py-3 sm:py-2">
              <div className="flex items-center justify-center w-full">
                <div className="w-full overflow-hidden">
                  <TopItems />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Signup isOpen={showSignup} onClose={closeSignup} />
      <Login isOpen={isLoginOpen} onClose={closeLogin} />
    </>
  );
};

export default Header;
