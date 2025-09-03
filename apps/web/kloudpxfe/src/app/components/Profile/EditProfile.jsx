"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useProfileContext } from "@/app/contexts/ProfileContext";

const EditProfile = () => {
  const { user } = useAuth();
  const { updateProfile } = useProfileContext();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    dob: "",
    gender: "",
  });

  const countries = [
    { code: "+91", flag: "https://flagcdn.com/w40/in.png" },
    {
      code: "+63",
      flag: "https://flagcdn.com/w40/ph.png",
    },

  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: `${user.first_name || ""}`.trim(),
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
    } catch (err) {
      console.log("Update failed", err);
    }
  };

  return (
    <div>
      <div className="bg-blue-50/30 sm:p-8 p-4 rounded-xl shadow-sm md:max-w-3xl w-full sm:space-y-6">
        <h2 className="text-2xl md:text-start text-center font-semibold sm:mb-4 mb-2">
          My Profile
        </h2>

        <div className="space-y-10 my-9">
          {/* Full Name */}
          <div>
            <label className="block text-xs dark-text mb-1">
              Full Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full border-2 px-4 py-2 outline-none mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
            />
          </div>
          {/* Phone */}
          <div>
            <label className="block text-xs dark-text mb-1">Phone</label>
            <div
              className={`flex items-center border-2 border-gray-200 py-2 outline-none mt-1 rounded-lg backdrop-blur-lg overflow-hidden ${
                user?.phone ? "opacity-60 bg-gray-200 pointer-events-none" : ""
              }`}
            >
              <select
                value={selectedCountry.code}
                onChange={(e) =>
                  setSelectedCountry(
                    countries.find((c) => c.code === e.target.value)
                  )
                }
                className="bg-white px-2 py-1 border-r border-gray-300 outline-none"
                disabled={!!user?.phone}
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    ({c.code})
                  </option>
                ))}
              </select>

              <span className="px-2">
                <img
                  src={selectedCountry.flag}
                  alt={`${selectedCountry.name} Flag`}
                  className="w-5 h-5 object-cover"
                />
              </span>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className={`w-full outline-none placeholder:text-xs`}
                placeholder="Phone Number"
                disabled={!!user?.phone}
              />
            </div>
          </div>

          {/* DOB & Gender */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs dark-text mb-1">
                Date of Birth<span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border-2 px-4 py-2 outline-none mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs dark-text mb-1">
                Gender<span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border-2 px-4 py-2 outline-none mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-center items-center md:max-w-3xl w-full sm:mt-10 mt-6 md:text-base text-sm">
        <button
          onClick={handleSave}
          className="bg-[#0070ba] text-white py-3 cursor-pointer px-20 w-full md:w-60 rounded-full"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
