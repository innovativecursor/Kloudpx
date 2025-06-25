import React from "react";

const SocialIcons = () => {
  return (
    <div>
      <div className="mt-8 flex items-center gap-5 cursor-pointer">
        {[
          {
            name: "Facebook",
            icon: "ri-facebook-fill",
            color: "hover:bg-blue-600 text-blue-600",
          },
          {
            name: "Twitter",
            icon: "ri-twitter-fill",
            color: "hover:bg-blue-400 text-blue-400",
          },
          {
            name: "Instagram",
            icon: "ri-instagram-fill",
            color: "hover:bg-pink-500 text-pink-500",
          },
          {
            name: "LinkedIn",
            icon: "ri-linkedin-fill",
            color: "hover:bg-blue-700 text-blue-700",
          },
          {
            name: "Pinterest",
            icon: "ri-pinterest-fill",
            color: "hover:bg-red-600 text-red-600",
          },
        ].map(({ name, icon, color }) => (
          <button
            key={name}
            aria-label={`Share on ${name}`}
            className={`group flex items-center cursor-pointer justify-center w-9 h-9 rounded-full border border-gray-300 bg-white shadow-sm transition ${color} hover:text-white`}
            type="button"
          >
            <i className={`${icon} text-xl group-hover:text-white`}></i>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SocialIcons;
