"use client";
import React from "react";
import Image from "next/image";
import returnex from "@/assets/returnex.png";
import { FaCheck } from "react-icons/fa";

const page = () => {
  return (
    <div className="pb-10 min-h-screen md:mt-62 sm:mt-48 mt-32">
      {/* Banner Section */}
      <Image
        src={returnex}
        alt="about banner"
        className="w-full h-auto object-cover"
        priority
      />

      {/* Content Section */}
      <div className="responsive-mx md:px-20 py-5 text-gray-700">
        {/* Return and Exchange */}
        <h2 className="text-lg md:text-xl font-semibold md:mt-10 mb-4 text-gray-800">
          RETURN AND EXCHANGE
        </h2>
        <p className="text-xs md:text-sm leading-relaxed mb-4">
          Any request to cancel an order after it has been submitted may be
          rejected. Kloud P&X reserves the right to cancel any transaction for
          legitimate and lawful reasons. We are committed to customer
          satisfaction. If you are not satisfied with your purchase, Kloud P&X
          offers a return policy for eligible items:
        </p>

 
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
            <FaCheck className="text-green-600 mt-1" />
            <span>
              The item must be defective or incorrect and returned within three
              (3) business days of receipt.
            </span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
            <FaCheck className="text-green-600 mt-1" />
            <span>
              The item must be in its original, unopened condition, unused,
              undamaged, and accompanied by the original receipt or proof of
              purchase.
            </span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
            <FaCheck className="text-green-600 mt-1" />
            <span>
              The product must not be a prescription drug unless it is defective
              or expired.
            </span>
          </li>
        </ul>

        <h3 className="md:text-md text-sm font-normal mb-2 text-gray-700">
          Despite our best efforts to ensure the security and accuracy of our
          services, Kloud P&X cannot be held responsible for any loss, damage,
          or similar circumstances caused by the following:
        </h3>
        <ul className="space-y-2 mb-6">
          <li className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
            <FaCheck className="text-green-600 mt-1" />
            <span>
              Events beyond our control, such as force majeure or acts of God.
            </span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
            <FaCheck className="text-green-600 mt-1" />
            <span>
              Incidents caused by external forces or third parties that are
              beyond Kloud P&X's control.
            </span>
          </li>
          <li className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
            <FaCheck className="text-green-600 mt-1" />
            <span>
              Products that are not handled, stored, or used properly after
              delivery.
            </span>
          </li>
        </ul>

        <p className="text-xs md:text-sm leading-relaxed text-center mt-5">
          In cases where damage or loss has been established, our liability will
          not exceed the value of the affected item or service at the time of
          the transaction. Claims for loss or damage must be submitted as soon
          as possible and within the time frame outlined in our return policy.
        </p>
      </div>
    </div>
  );
};

export default page;
