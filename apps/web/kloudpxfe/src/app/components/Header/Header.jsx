"use client";
import { useEffect, useState, useCallback } from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import SearchComponent from "../SearchComponent/SearchComponent";
import MobileSearchBar from "../MobileSearch/MobileSearchBar";
import MobileDrawer from "../MobileDrawer/MobileDrawer";
import CartDropdown from "../CartDropdown/CartDropdown";
import pumaImage from "@/assets/puma_image.png";
import logo from "@/assets/quiksie-logo.svg";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import kloud from "@/assets/Kloud_logo.webp";
function Header() {
  const [isTopbarVisible, setIsTopbarVisible] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCartHovered, setIsCartHovered] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);

  const pathname = usePathname();
  const router = useRouter();

  // Cart items state with proper typing structure
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Puma Unisex-Adult Flair Riding Running Shoe",
      price: "1,499",
      image: pumaImage,
    },
    {
      id: 2,
      name: "BATMAN: METAL DIE-CAST BAT-SIGNAL",
      price: "2,857",
      image:
        "https://c1-ebgames.eb-cdn.com.au/merchandising/images/packshots/658da15d2cee48378fee311870304ccd_Original.png",
    },
  ]);

  // Optimized event handlers with useCallback
  const handleTopbarClose = useCallback(() => {
    setIsTopbarVisible(false);
  }, []);

  const toggleDrawer = useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const handleAddToCart = useCallback((item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  }, []);

  const handleCartMouseEnter = useCallback(() => {
    setIsCartHovered(true);
  }, []);

  const handleCartMouseLeave = useCallback(() => {
    setIsCartHovered(false);
  }, []);

  // Navigation categories for better maintainability
  const navigationCategories = [
    "Medicines",
    "Personal Care",
    "Health Conditions",
    "Vitamins & Supplements",
    "Diabetes Care",
    "Healthcare Devices",
    "Medical Devices",
    "OTC Drugs",
  ];

  // Update cart count when items change
  useEffect(() => {
    setCartItemCount(cartItems.length);
  }, [cartItems]);

  return (
    <>
      {/* Top promotional bar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isTopbarVisible
            ? "opacity-100 translate-y-0 h-auto"
            : "opacity-0 -translate-y-full h-0 overflow-hidden"
        } bg-gradient-to-r from-blue-500 to-purple-600 text-white`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex-1 text-center">
              <p className="text-sm font-medium">
                🔥 Summer Sale up to 60% OFF selected items
              </p>
            </div>
            <button
              onClick={handleTopbarClose}
              className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              aria-label="Close promotional banner"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header className="bg-white shadow-[0_3px_5px_0_rgba(210,217,237,0.3)] sticky top-0 z-50">
        {/* Primary navigation */}
        <div className="border-b border-gray-100">
          <div className="container mx-auto px-4">
            <nav className="flex items-center justify-between h-16">
              {/* Left section - Mobile menu + Logo */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDrawer}
                  className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
                  aria-label="Open mobile menu"
                >
                  <Image
                    src={kloud}
                    alt="Menu"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </button>

                <Link href="/" className="flex-shrink-0">
                  <Image
                    src={kloud}
                    alt="Quiksie Logo"
                    width={120}
                    height={40}
                    className="h-8 w-auto"
                    priority
                  />
                </Link>
              </div>

              {/* Center section - Search (hidden on mobile) */}
              <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                <SearchComponent />
              </div>

              {/* Right section - User actions */}
              <div className="flex items-center space-x-6">
                {/* Login link - hidden on mobile */}
                <Link
                  href="/login"
                  className="hidden sm:flex flex-col items-center group"
                >
                  <Image
                    src="https://cms.myzow.in/images/icons/icon-user.png"
                    alt="User"
                    width={20}
                    height={20}
                    className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200"
                  />
                  <span className="text-xs text-gray-600 group-hover:text-gray-900">
                    Login
                  </span>
                </Link>

                {/* Cart */}
                <div
                  className="relative"
                  onMouseEnter={handleCartMouseEnter}
                  onMouseLeave={handleCartMouseLeave}
                >
                  <Link
                    href="/cart"
                    className="flex flex-col items-center group"
                  >
                    <div className="relative">
                      <Image
                        src="https://cms.myzow.in/images/icons/icon-shopping-cart.png"
                        alt="Cart"
                        width={20}
                        height={20}
                        className="w-5 h-5 mb-1 group-hover:scale-110 transition-transform duration-200"
                      />
                      {cartItemCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                          {cartItemCount}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 group-hover:text-gray-900">
                      My Cart
                    </span>
                  </Link>

                  {/* Cart dropdown */}
                  {isCartHovered && (
                    <div className="absolute right-0 top-full mt-2 z-50">
                      <CartDropdown cartItems={cartItems} />
                    </div>
                  )}
                </div>
              </div>
            </nav>

            {/* Mobile search bar */}
            <div className="md:hidden pb-3">
              <MobileSearchBar />
            </div>
          </div>
        </div>

        {/* Secondary navigation - Categories */}
        <div className="hidden lg:block bg-gray-50">
          <div className="container mx-auto px-4">
            <nav className="flex items-center h-12">
              <button
                onClick={toggleDrawer}
                className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-200 mr-6"
              >
                <HiOutlineMenuAlt1 className="w-5 h-5" />
                <span className="text-sm font-medium">All Categories</span>
              </button>

              <div className="flex items-center space-x-1 overflow-x-auto">
                {navigationCategories.map((category, index) => (
                  <Link
                    key={index}
                    href="/browse"
                    className="whitespace-nowrap px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-white rounded-md transition-all duration-200"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {/* <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      /> */}
    </>
  );
}

export default Header;
