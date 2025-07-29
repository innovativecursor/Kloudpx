"use client";

import React, { useEffect } from "react";
import Logo from "@/app/components/logo/Logo";
import SearchBar from "@/app/components/searchbar/SearchBar";
import TopItems from "@/app/components/topitems/TopItems";
import Hamburger from "@/app/components/modal/Hamburger";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCartContext } from "@/app/contexts/CartContext";
import { useRouter } from "next/navigation";
import { FiShoppingCart } from "react-icons/fi";
import CartModal from "@/app/components/modal/CartModal";
import useModal from "@/app/hooks/useModal";
import { RiAccountCircleLine } from "react-icons/ri";

const Header = () => {
  const router = useRouter();
  const { login, loading, user, isAuthLoaded } = useAuth();
  const { cartLength } = useCartContext();
  const { isOpen, setIsOpen, modalRef } = useModal();

  return (
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
          <div className="flex items-center gap-2">
            <div>
              {!isAuthLoaded ? null : !loading && user ? (
                // <UserProfile user={user} logout={logout} />
                <RiAccountCircleLine
                  className="text-4xl cursor-pointer"
                  onClick={() => router.push("/Profile")}
                />
              ) : (
                <div
                  onClick={!loading ? login : undefined}
                  className="font-semibold sm:text-xs text-xs cursor-pointer"
                >
                  {loading ? "Signing In..." : "Login/Signup"}
                </div>
              )}
            </div>

            {/* Cart Icon with Hover */}
            <div
              className="relative cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              <FiShoppingCart className="md:text-3xl text-2xl font-light" />
              <span className="absolute -top-1 -right-1 text-[10px] bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {isAuthLoaded ? cartLength : 0}
              </span>

              {/* Cart Modal */}
              <CartModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
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
              {/* <div className="w-fit bg-white">
                <Hamburger />
              </div> */}
              <div className="w-full overflow-hidden">
                <TopItems />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
