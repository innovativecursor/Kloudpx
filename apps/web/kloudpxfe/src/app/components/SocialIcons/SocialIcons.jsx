"use client";

import React, { useState, useEffect } from "react";
import useModal from "@/app/hooks/useModal";
import toast from "react-hot-toast";

const SocialIcons = () => {
  const {
    isOpen: isModalOpen,
    setIsOpen: setIsModalOpen,
    modalRef,
  } = useModal();

  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: "ri-whatsapp-fill",
      color: "hover:bg-green-500 text-green-500",
      link: `https://wa.me/?text=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "Facebook",
      icon: "ri-facebook-fill",
      color: "hover:bg-blue-600 text-blue-600",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
    },
    {
      name: "Viber",
      icon: "ri-phone-fill",
      color: "hover:bg-purple-600 text-purple-600",
      link: `viber://forward?text=${encodeURIComponent(currentUrl)}`,
    },
    {
      name: "Gmail",
      icon: "ri-mail-fill",
      color: "hover:bg-red-600 text-red-600",
      link: `mailto:?subject=Check this out&body=${encodeURIComponent(
        currentUrl
      )}`,
    },
    {
      name: "Copy Link",
      icon: "ri-link",
      color: "hover:bg-gray-500 text-gray-500",
      onClick: () => {
        if (currentUrl) {
          navigator.clipboard.writeText(currentUrl);
          toast.success("Link copied to clipboard!");
        }
      },
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(true)}
        className="sm:w-10 sm:h-10 w-7 h-7 rounded-full cursor-pointer flex items-center justify-center border border-gray-300 bg-white shadow-sm text-gray-600 hover:bg-gray-100"
        aria-label="Open Share Modal"
      >
        <i className="ri-share-fill sm:text-xl text-sm"></i>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg py-9 px-10 shadow-lg lg:w-[30%] sm:w-[40%]"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-normal opacity-70">
                Share Product With
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-red-500 cursor-pointer"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-7 items-center justify-center">
              {shareOptions.map(({ name, icon, color, link, onClick }) =>
                onClick ? (
                  <div
                    key={name}
                    className="flex flex-col items-center justify-center gap-1"
                  >
                    <button
                      onClick={onClick}
                      className={`group flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white shadow-sm transition ${color} hover:text-white`}
                    >
                      <i
                        className={`${icon} text-xl group-hover:text-white`}
                      ></i>
                    </button>
                    <span className="text-xs text-center text-gray-600">
                      {name}
                    </span>
                  </div>
                ) : (
                  <div
                    key={name}
                    className="flex flex-col items-center justify-center gap-1"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 bg-white shadow-sm transition ${color} hover:text-white`}
                    >
                      <i
                        className={`${icon} text-xl group-hover:text-white`}
                      ></i>
                    </a>
                    <span className="text-xs text-center text-gray-600">
                      {name}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialIcons;
