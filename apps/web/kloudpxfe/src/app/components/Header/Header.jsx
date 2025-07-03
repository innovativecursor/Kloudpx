"use client";
import React from "react";
import Logo from "@/app/components/logo/Logo";
import SearchBar from "@/app/components/searchbar/SearchBar";
import TopItems from "@/app/components/topitems/TopItems";
import Hamburger from "@/app/components/modal/Hamburger";
import { useAuth } from "@/app/contexts/AuthContext";
import { useCartContext } from "@/app/contexts/CartContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const Header = () => {
  const router = useRouter();
  const { login, loading, user, token } = useAuth();
  const { cartLength } = useCartContext();

  const handleCartClick = () => {
    if (token) {
      router.push("/Cart");
    } else {
      toast.error("Please login to access your cart");
    }
  };

  return (
    <div className="">
      <div className="flex-between-center responsive-mx mt-3">
        <div className="flex-between-center lg:w-[75%] sm:w-[75%] w-[45%]">
          <Logo />
          <SearchBar />
        </div>
        <div className="flex-between-center sm:gap-6 gap-3">
          <div
            onClick={!user && !loading ? login : undefined}
            className="font-semibold sm:text-xs text-xs cursor-pointer"
          >
            {loading
              ? "Signing In..."
              : user
              ? `Hi, ${user.first_name} ${user.last_name}`
              : "Login/Signup"}
          </div>
          <div className="flex gap-3 sm:gap-6 items-center text-color">
            {/* <div className="relative">
              <i className="ri-heart-3-line text-xl font-medium"></i>
              <span className=" absolute -top-0 -right-1 text-[8px] bg-red-600 text-white rounded-full w-3 h-3 flex items-center justify-center">
                0
              </span>
            </div> */}
            <div onClick={handleCartClick} className="relative cursor-pointer">
              <i className="ri-shopping-cart-line text-xl font-medium"></i>
              <span className="absolute -top-0 -right-1 text-[8px] bg-red-600 text-white rounded-full w-3 h-3 flex items-center justify-center">
                {cartLength}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex-between-center  border-t border-b border-gray-200">
          <div className="w-full px-3 md:px-[8vw] py-3 sm:py-4">
            <div className="flex items-center justify-center  w-full">
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
