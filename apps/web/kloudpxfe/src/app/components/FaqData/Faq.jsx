import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

const Faq = ({ data = [], showAll = false }) => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);
  const router = useRouter();
  const handleViewMore = () => {
    router.push("/Faq");
  };
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const displayFaqs = showAll ? data : data.slice(0, 4);

  useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, displayFaqs.length);
  }, [displayFaqs.length]);

  return (
    <div className="md:max-w-3xl w-full mx-auto mt-14 sm:mt-16 md:mt-28">
      <h1 className="text-center font-semibold sm:mb-6 mb-2 text-[#00243F] tracking-wide md:text-lg">
        Frequently Asked Questions (FAQs)
      </h1>

      <div className="mt-6 space-y-2 cursor-pointer">
        {displayFaqs.map((faq, index) => (
          <div key={index} className="text-xs tracking-wider font-medium">
            {openIndex === index && (
              <div className="border-t border-gray-300"></div>
            )}

            <button
              onClick={() => toggleFAQ(index)}
              className={`flex justify-between items-center w-full text-left px-6 py-5 transition-all duration-300 ${
                openIndex === index
                  ? "bg-[#0070BA]/80 text-white rounded-t-md"
                  : "text-[#00243F] font-semibold border-b border-gray-300"
              }`}
            >
              <span>
                {index + 1}. {faq.question}
              </span>
              <i
                className={`ri-${
                  openIndex === index ? "subtract-line" : "add-line"
                } text-lg cursor-pointer`}
              ></i>
            </button>

            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className={`transition-all duration-500 ease-in-out overflow-hidden bg-[#0070BA]/80 px-6 mb-6 text-white text-xs rounded-b-md`}
              style={{
                maxHeight:
                  openIndex === index
                    ? `${contentRefs.current[index]?.scrollHeight || 100}px`
                    : "0px",
                paddingBottom: openIndex === index ? "4rem" : "0px",
              }}
            >
              {faq.answer}
            </div>
          </div>
        ))}
      </div>

      {/* View More Button (only on /) */}
      {!showAll && (
        <div className="flex justify-center md:mt-6 mt-2">
          <button
            onClick={handleViewMore}
            className="text-[10px] font-normal bg-[#0070BA] rounded-full text-white cursor-pointer sm:py-2 py-1.5 px-6 sm:px-5"
          >
            View More
            <i className="ri-arrow-right-s-line"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Faq;
