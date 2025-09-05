
import React from "react";
import Image from "next/image";
import termscon from "@/assets/termscon.png";
import { FaCheck } from "react-icons/fa";

const Page = () => {
  return (
    <div className="pb-10 min-h-screen md:mt-62 sm:mt-48 mt-32">
      {/* Banner Section */}
      <Image
        src={termscon}
        alt="about banner"
        className="w-full h-auto object-cover"
        priority
      />

      {/* Content Section */}
      <div className="responsive-mx  md:px-20 py-10 text-gray-700">
        {/* Terms */}
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
          TERMS AND CONDITIONS
        </h2>
        <p className="text-xs md:text-sm leading-relaxed mb-4">
          Welcome to the Kloud P&X website, your gateway to a wealth of
          information and services. By accessing this Site, you acknowledge and
          accept the entirety of these Terms and Conditions. If you do not agree
          with any part of these terms, we respectfully request that you refrain
          from utilizing the Site. The information and services presented are
          intended exclusively for general educational purposes and should not
          be interpreted as a substitute for professional medical advice. We
          strongly encourage individuals to consult with a qualified healthcare
          provider for any medical concerns or conditions they may encounter.
          Kloud P&X explicitly disclaims any liability regarding medical
          diagnoses or treatments provided on this Site, as well as for any
          reliance you may place on the information disclosed.
        </p>
        <p className="text-xs md:text-sm leading-relaxed mb-4">
          Should you decide to post content on the Site, you are obligated to
          refrain from uploading any materials that may be deemed unlawful,
          offensive, or infringing upon the rights of others. It is essential to
          recognize that while you retain ownership of your submitted content,
          you grant Kloud P&X a non-exclusive, royalty-free license to use,
          distribute, and display that content. We reserve the right to review
          and remove any content that we deem to violate these Terms. It is
          important to note that the opinions expressed by other users of the
          Site do not necessarily reflect the official viewpoints of Kloud P&X.
        </p>
        <p className="text-xs md:text-sm leading-relaxed mb-4">
          All content available on the Site is owned or licensed by Kloud P&X
          and is protected under applicable intellectual property laws.
          Consequently, any unauthorized copying, reproduction, or other forms
          of usage of the content without prior permission is strictly
          prohibited. When you engage in purchases through the Site, you agree
          to provide accurate and complete payment and delivery information.
          Ownership of the products will transfer to you only upon full payment
          for those items. Please be aware that delivery timelines provided are
          to be considered approximate, and Kloud P&X shall not assume liability
          for any delivery delays, loss, or damage incurred once products have
          been dispatched from our facilities. Additional charges for delivery
          may apply, and any requests for refunds will be considered at our
          discretion unless otherwise specified.
        </p>
        <p className="text-xs md:text-sm leading-relaxed mb-4">
          Kloud P&X, along with its partners and affiliates, disclaims any
          liability for damages arising from your use of the Site or the
          products obtained therein, including but not limited to technical
          malfunctions, interruptions, or inaccuracies in information provided.
          Furthermore, we shall not be held responsible for delays caused by
          unforeseen events beyond our control, including but not limited to
          natural disasters, governmental actions, or other events of force
          majeure.
        </p>
        <p className="text-xs md:text-sm leading-relaxed mb-4">
          We retain the right to amend these Terms or update the Site at any
          given time without prior notice. Your continued use of the Site shall
          signify your acceptance of any amendments made. These Terms shall be
          governed by and construed by the laws of the Philippines, and any
          disputes arising therefrom shall be settled in the appropriate
          Philippine courts. The failure of Kloud P&X to enforce any right or
          provision within this agreement does not constitute a waiver of that
          right or any other rights under this agreement. We may assign our
          rights and obligations under these Terms without your consent. Lastly,
          nothing in this document shall be construed as creating a partnership
          or agency relationship between you and Kloud P&X.
        </p>

        {/* Return and Exchange */}
        <h2 className="text-lg md:text-xl font-semibold mt-10 mb-4 text-gray-800">
          RETURN AND EXCHANGE
        </h2>
        <p className="text-xs md:text-sm leading-relaxed mb-4">
          Any request to cancel an order after it has been submitted may be
          rejected. Kloud P&X reserves the right to cancel any transaction for
          legitimate and lawful reasons. We are committed to customer
          satisfaction. If you are not satisfied with your purchase, Kloud P&X
          offers a return policy for eligible items:
        </p>

        <h3 className="text-md font-semibold mb-2 text-gray-700">
          Eligibility for Returns:
        </h3>
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

        <h3 className="md:text-md text-sm font-semibold mb-2 text-gray-700">
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

        <p className="text-xs md:text-sm leading-relaxed">
          In cases where damage or loss has been established, our liability will
          not exceed the value of the affected item or service at the time of
          the transaction. Claims for loss or damage must be submitted as soon
          as possible and within the time frame outlined in our return policy.
        </p>
      </div>
    </div>
  );
};

export default Page;
