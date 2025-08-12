"use client";
import React from "react";
import { FaUserTie, FaTruck } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";

const DeliveryHome = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 md:px-12 lg:px-20">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Image */}
        <div>
          <img
            src="/delivery-img1.png"
            alt="Delivery Service"
            className="w-full h-auto"
          />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-2xl font-bold mb-4">100% Authentic Medicines</h2>
          <p className="text-gray-600 mb-6">
            Our licensed pharmacists are available to provide personalized advice
            and answer your questions about medications, potential interactions,
            and side effects. We ensure you have all the information you need
            for safe and effective treatment.
          </p>

          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-xl">
              <FaUserTie />
            </div>
            <div>
              <p className="font-semibold">Professional Staff</p>
              <p className="text-gray-500 text-sm">
                Trained and certified pharmacists
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-16">
        {/* Text */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Fast &amp; Secure Delivery Service
          </h2>
          <p className="text-gray-600 mb-6">
            Get your medications and health products delivered right to your
            doorstep with our reliable delivery service. We ensure your privacy
            and the integrity of your medications with temperature-controlled
            packaging and discreet delivery options.
          </p>

          {/* Same-Day Delivery */}
          <div className="flex items-start space-x-3 mb-4">
            <div className="text-blue-500 text-xl">
              <FaTruck />
            </div>
            <div>
              <p className="font-semibold">Same-Day Delivery</p>
              <p className="text-gray-500 text-sm">
                For orders placed before 2 PM
              </p>
            </div>
          </div>

          {/* Secure Packaging */}
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-xl">
              <MdOutlineSecurity />
            </div>
            <div>
              <p className="font-semibold">Secure Packaging</p>
              <p className="text-gray-500 text-sm">
                Temperature-controlled and tamper-evident
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div>
          <img
            src="/delivery-img2.png"
            alt="Pharmacy Store"
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryHome;