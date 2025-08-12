"use client";
import { FaShieldAlt, FaTruck, FaClock, FaThumbsUp } from "react-icons/fa";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <FaShieldAlt className="w-8 h-8 text-blue-600" />,
      title: "Genuine Medications",
      description: "All our medications are sourced directly from authorized manufacturers",
    },
    {
      icon: <FaTruck className="w-8 h-8 text-blue-600" />,
      title: "Fast Delivery",
      description: "Get your medications delivered within 24 hours",
    },
    {
      icon: <FaClock className="w-8 h-8 text-blue-600" />,
      title: "Customer Support",
      description: "Our pharmacists are available round the clock for consultation",
    },
    {
      icon: <FaThumbsUp className="w-8 h-8 text-blue-600" />,
      title: "Best Prices",
      description: "We offer competitive prices and regular discounts",
    },
  ];

  return (
    <section className="bg-blue-50 py-12 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          Why Choose KloudPharma
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          We're committed to providing the highest quality pharmaceutical services with a focus on patient care and satisfaction.
        </p>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Learn more button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-full shadow-lg transition">
          Learn More About Us
        </button>
      </div>
    </section>
  );
}
