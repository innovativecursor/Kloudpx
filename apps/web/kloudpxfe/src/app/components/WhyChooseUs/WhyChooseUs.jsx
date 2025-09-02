"use client";
import usePageLoader from "@/app/hooks/usePageLoader";
import Link from "next/link";
import { FaShieldAlt, FaTruck, FaClock, FaThumbsUp } from "react-icons/fa";
import "swiper/css";

export default function WhyChooseUs() {

    const { startLoader } = usePageLoader();

  const features = [
    {
      icon: <FaShieldAlt className="w-6 h-6 text-[#0070ba]" />,
      title: "Genuine Medications",
      description:
        "All our medications are sourced directly from authorized manufacturers",
    },
    {
      icon: <FaTruck className="w-6 h-6 text-[#0070ba]" />,
      title: "Fast Delivery",
      description: "Get your medications delivered within 24 hours",
    },
    {
      icon: <FaClock className="w-6 h-6 text-[#0070ba]" />,
      title: "Customer Support",
      description:
        "Our pharmacists are available round the clock for consultation",
    },
    {
      icon: <FaThumbsUp className="w-6 h-6 text-[#0070ba]" />,
      title: "Best Prices",
      description: "We offer competitive prices and regular discounts",
    },
  ];

  return (
    <div className="bg-[#F5FAFF]">
      <section className="responsive-mx sm:py-16 py-12 md:mt-20 sm:mt-16 mt-10">
        <div className="text-center">
          <h2 className="sm:text-2xl text-xl font-semibold mb-2">
            Why Choose KloudPharma
          </h2>
          <p className="text-gray-600 font-normal sm:text-sm text-xs tracking-wider mt-4">
            We're committed to providing the highest quality pharmaceutical
            services with a focus on
          </p>
          <p className="text-gray-600 font-normal sm:text-sm text-xs tracking-wider mt-1">
            patient care and satisfaction.
          </p>

          {/* Swiper Slider */}
          <div className="sm:mt-12 mt-8 sm:mb-10 mb-8 lg:mx-20">
            <div className=" grid gap-5 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
              {features.map((feature, idx) => (
                <div key={idx}>
                  <div className="bg-white rounded-xl mb-1 shadow-sm h-48 p-6 cursor-pointer flex flex-col items-start justify-center hover:shadow-lg transition">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-blue-50/50 p-3 rounded-full">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-start text-base">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-800 font-light tracking-wide mt-4 text-start text-sm ">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learn more button */}
          <Link href="/Aboutus"     onClick={startLoader}>
            <button className="bg-[#0070ba] text-white text-sm font-medium px-10 cursor-pointer sm:py-4 py-3 rounded-full shadow-lg transition">
              Learn More About Us
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
