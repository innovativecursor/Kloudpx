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
    <div className="bg-blue-50/20 p-8 rounded-xl shadow-sm md:max-w-3xl w-full space-y-6">
      <h2 className="text-xl md:text-start text-center font-semibold mb-4">
        My Profile
      </h2>

      <div className="space-y-10 my-8">
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
          <div className="flex items-center border border-gray-100 rounded-md overflow-hidden">
            <span className="bg-white px-4 py-2 text-sm">🇺🇸</span>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border-2 px-4 py-2 outline-none mt-1 rounded-lg placeholder:text-xs border-gray-200 backdrop-blur-lg"
            />
          </div>
        </div>

        <div>
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
        </div>

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
  );
};

export default EditProfile;
