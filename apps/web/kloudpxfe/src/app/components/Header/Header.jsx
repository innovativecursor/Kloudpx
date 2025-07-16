"use client";

import React from "react";
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
import UserProfile from "../Profile/UserProfile";

const Header = () => {
  const router = useRouter();
  const { login, loading, user, token, logout } = useAuth();
  const { cartLength } = useCartContext();
  const { isOpen, setIsOpen, modalRef } = useModal();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow-sm">
      <div className="flex-between-center items-baseline responsive-mx mt-2">
        <div className="flex-between-center items-baseline lg:w-[85%] sm:w-[75%] w-[45%]">
          <Logo />
          <SearchBar />
        </div>
        <div className="flex-between-center items-center sm:gap-6 gap-3">
          <div>
            {!loading && user ? (
              <UserProfile user={user} logout={logout} />
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
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div>
              {/* <i className="ri-shopping-cart-line text-xl font-medium"></i> */}
              <FiShoppingCart className="text-3xl" />
              <span className="absolute -top-0 -right-1 text-[8px] bg-red-600 text-white rounded-full w-3 h-3 flex items-center justify-center">
                {cartLength}
              </span>
            </div>

            {/* Cart Modal */}
            <CartModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
          </div>
        </div>
      </div>

      {/* Hamburger & Top Items */}
      <div className="mt-5">
        <div className="flex-between-center border-t border-b border-gray-200">
          <div className="w-full px-3 md:px-[8vw] py-3 sm:py-2">
            <div className="flex items-center justify-center w-full">
              <div className="w-fit bg-white">
                <Hamburger />
              </div>
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
