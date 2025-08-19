"use client";
import React from "react";
import Image from "next/image";
import privacy from "@/assets/privacy.png";
import { FaCheck } from "react-icons/fa";

const PrivacyPolicy = () => {
  return (
    <div className="pb-10 min-h-screen md:mt-62 sm:mt-48 mt-32">
      {/* Page Title */}
      <Image
        src={privacy}
        alt="about banner"
        className="w-full h-auto object-cover"
        priority
      />

      <div className="responsive-mx md:px-20 py-10 text-gray-700">
        <h2 className="text-lg md:text-xl font-semibold mb-2 text-gray-800">
          Patient Privacy Protection Notice
        </h2>
        <h2 className="text-base font-medium mb-4 text-gray-800">
          Privacy Principles
        </h2>

        {/* Intro */}
        <p className="text-gray-700 leading-relaxed mb-6 md:text-sm text-xs">
          At Kloud P&X, we prioritize the protection of your privacy and the
          confidentiality of your health information. This Privacy Policy
          describes how we collect, use, disclose, and protect your personal and
          health information in compliance with the Philippine Data Privacy Act
          of 2012 (Republic Act No. 10173), the FDA Administrative Orders, and
          other applicable privacy laws and regulations. By accessing and using
          our online pharmacy services, you agree to the terms outlined in this
          policy.
        </p>

        <p className="text-sm font-medium md:text-base leading-relaxed mb-4">
          We strive to establish an ambiance of trust and assurance among our
          workers, clients, and associates, centered on the following privacy
          and data protection principles:
        </p>

        {/* Principles */}
        <ul className="space-y-2 mb-6">
          {[
            {
              title: "Transparency",
              desc: "Kloud P&X offers clear information on how we collect, process, and deploy personal information to establish trust with our workers and clients.",
            },
            {
              title: "Data Minimization",
              desc: "Kloud P&X collects only the data fundamental to attaining legitimate objectives while avoiding unnecessary data processing.",
            },
            {
              title: "Security",
              desc: "Kloud P&X employs robust security practices to shield personal information from unauthorized access, loss, or abuse.",
            },
            {
              title: "User Consent and Control",
              desc: "Kloud P&X respects and obtains user permission, allowing us control of their personal information whenever possible.",
            },
            {
              title: "Compliance",
              desc: "Kloud P&X adheres strictly to all relevant legislation, regulations, and industry standards to ensure the total privacy and protection of your data.",
            },
            {
              title: "Accountability",
              desc: "Kloud P&X takes responsibility for ensuring that our data practices align with these principles and address concerns promptly.",
            },
          ].map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs md:text-sm text-gray-700"
            >
              <FaCheck className="text-green-600 mt-1" />
              <span>
                <span className="font-semibold">{item.title}</span> –{" "}
                {item.desc}
              </span>
            </li>
          ))}
        </ul>

        {/* Definitions */}
        <h2 className="text-base font-medium mb-4 text-gray-800">DEFINITION</h2>
        <p className="text-sm md:text-base leading-relaxed mb-4">
          For this Policy, the following definitions shall apply:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            {
              title: "Confidentiality",
              desc: "refers to the obligation of an individual or organization to safeguard entrusted information.",
            },
            {
              title: "Data Privacy Act (DPA)",
              desc: "refers to Republic Act No. 10173 or the Data Privacy Act of 2012.",
            },
            {
              title: "Personal Data",
              desc: "refers to personal information, sensitive personal information, and privileged information as defined by the Data Privacy Act of 2012.",
            },
            {
              title: "NPC",
              desc: "refers to the National Privacy Commission of the Philippines, as created by the Data Privacy Act of 2012.",
            },
            {
              title: "Processing",
              desc: "refers to any operation or any set of operations performed upon personal information, including, but not limited to, the collection, recording, organization, storage, updating or modification, retrieval, consultation, use, consolidation, blocking, erasure, or destruction of data.",
            },
          ].map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs md:text-sm text-gray-700"
            >
              <FaCheck className="text-green-600 mt-1" />
              <span>
                <span className="font-semibold">{item.title}</span> –{" "}
                {item.desc}
              </span>
            </li>
          ))}
        </ul>

        {/* Privacy Policy Section */}
        <h2 className="text-lg md:text-xl text-center font-semibold mb-6 text-gray-800">
          PRIVACY POLICY
        </h2>

        {/* PROCESSING */}
        <h3 className="text-base font-semibold mb-2">PROCESSING</h3>
        <p className="font-medium"> a. Collection of Personal Data:</p>
        <p className="mb-4 text-xs md:text-sm">
          Personal data may be collected from patients, clients, and consumers
          in a variety of ways, including electronic intake, order forms,
          prescriptions, and information request forms, as well as during pickup
          instances.
        </p>
        <p className="mb-2 text-sm md:text-base font-semibold">
          The collected personal data may include, but is not limited to:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            "Personal information, such as name, sex, date of birth, and email address",
            "Contact details, such as home address, email address, and mobile number",
            "Health-related data and prescription information",
          ].map((text, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs md:text-sm text-gray-700"
            >
              <FaCheck className="text-green-600 mt-1" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <p className="mb-4 text-sm md:text-base font-semibold">
          b. Use of Personal Data
        </p>
        <p className="mb-2 text-sm md:text-base font-medium">
          The use of Kloud P&X clients and customers’ personal information must
          always be consistent with its mission. More particularly, the use of
          personal data may be any of the following:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            "Offer pharmaceutical services, including prescription processing, pharmacological information, and consultation",
            "Offer communication services, special offers, and promotions or marketing communications",
            "Process payments, billing, transactions, and order tracking",
            "Comply with regulatory requirements and legal obligations",
          ].map((text, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs md:text-sm text-gray-700"
            >
              <FaCheck className="text-green-600 mt-1" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        {/* SECURITY */}
        <h3 className="text-base font-semibold mb-2">SECURITY MEASURES</h3>
        <p className="mb-2 text-sm md:text-base font-semibold">
          a. Physical Security Measures
        </p>
        <p className="mb-6 text-sm md:text-base">
          Kloud P&X employs strict physical controls to protect data, such as
          secure office spaces, restricted access areas, and proper handling of
          physical documents containing personal information.
        </p>
        <p className="mb-2 text-sm md:text-base font-semibold">
          b. Technical Security Measures
        </p>
        <p className="mb-6 text-sm md:text-base">
          Technical safeguards (firewalls, encryption, password-protected
          systems, and regular system audits) are in place to prevent
          unauthorized access to electronic data.
        </p>

        {/* RIGHTS */}
        <h3 className="text-base font-semibold mb-2">
          YOUR RIGHTS AS DATA SUBJECT
        </h3>
        <p className="mb-4 text-sm md:text-base">
          Under the Philippine Data Privacy Act, you are entitled to the
          following rights regarding your data:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            "Right to Access",
            "Right to Rectification",
            "Right to Object",
            "Right to Erasure or Blocking",
            "Right to Data Portability",
          ].map((text, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs md:text-sm text-gray-700"
            >
              <FaCheck className="text-green-600 mt-1" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <p className="text-center text-sm md:text-base font-medium mb-8">
          To exercise any of these rights, please contact us through the contact
          details provided below.
        </p>

        {/* COMPLIANCE */}
        <h3 className="text-base font-semibold mb-2">
          COMPLIANCE WITH PHILIPPINE LAWS
        </h3>
        <ul className="space-y-2 mb-6">
          {[
            "Data Privacy Act of 2012 (Republic Act No. 10173)",
            "FDA Circulars and Administrative Orders",
            "Other applicable healthcare privacy and data security regulations",
          ].map((text, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs md:text-sm text-gray-700"
            >
              <FaCheck className="text-green-600 mt-1" />
              <span>{text}</span>
            </li>
          ))}
        </ul>

        {/* CHANGES */}
        <h3 className="text-base font-semibold mb-2">
          CHANGES IN PRIVACY POLICY
        </h3>
        <p className="mb-6 text-sm md:text-base">
          Kloud P&X reserves the right to revise this Policy from time to time
          to reflect changes in our practices, technology, legal obligations, or
          business operations. Any updates will be communicated through our
          website, email, or at the point of service.
        </p>

        {/* COMPLAINT */}
        <h3 className="text-base font-semibold mb-2">COMPLAINT IN NPC</h3>
        <p className="mb-6 text-sm md:text-base">
          If you believe that your data privacy rights have been violated, you
          may file a complaint with the National Privacy Commission (NPC) or
          other relevant authorities.
        </p>

        {/* CONTACT */}
        <h3 className="text-base font-semibold mb-2">CONTACT US</h3>
        <ul className="space-y-2 text-xs md:text-sm mb-2">
          {[
            "📧 Email: info@kloudpx.com",
            "📞 Contact Number: +63 912 345 6789",
            "🏢 Address: Unit 4, Second Floor, Emmanue Jose Green Building #123 EDSA, Mandaluyong City, Philippines",
          ].map((text, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-xs md:text-sm text-gray-700"
            >
              <FaCheck className="text-green-600 mt-1" />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
