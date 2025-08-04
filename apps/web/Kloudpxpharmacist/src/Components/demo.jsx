"use client";

import React, { useState } from "react";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full bg-red-500 flex justify-center flex-col items-center">
      <div className="bg-blue-50 p-8  rounded-xl shadow-sm md:max-w-3xl w-full space-y-6">
        <h2 className="text-xl md:text-start text-center font-semibold mb-4">
          My Profile
        </h2>

        <div className="space-y-10 my-9">
          <div>
            <label className="block text-xs dark-text mb-1">
              Full Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="name"
              className="w-full border-2 px-4 py-2 outline-none mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
            />
          </div>

          <div>
            <label className="block text-xs dark-text mb-1">Phone</label>
            <div className="flex items-center border-2 border-gray-200 py-2 outline-none mt-1 rounded-lg backdrop-blur-lg overflow-hidden">
              <span className="bg-white px-4 ">
                <img
                  src="https://flagcdn.com/w40/ph.png"
                  alt="Philippines Flag"
                  className="w-5 h-5 object-cover"
                />
              </span>
              <input
                type="number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full outline-none placeholder:text-xs"
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-xs dark-text mb-1">
              E-mail Id<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border-2 px-4 py-2 outline-none mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
            />
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs dark-text mb-1">
                Age<span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full border-2 px-4 py-2 outline-none mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
              />
            </div>

            <div>
              <label className="block text-xs dark-text mb-1">
                Gender<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full border-2 px-4 py-2 outline-none mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center md:max-w-3xl w-full mt-10 text-xs">
        <button className="bg-[#0070ba] text-white py-3 cursor-pointer px-12 rounded-full">
          Save
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
