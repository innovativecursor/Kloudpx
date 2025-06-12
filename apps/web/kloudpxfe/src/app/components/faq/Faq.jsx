'use client';
import React, { useState, useRef } from 'react';

const faqs = [
  {
    question: 'Do I need a prescription to order medicine online?',
    answer:
      'Yes, for prescription medications, you’ll need to upload a valid prescription during checkout. For over-the-counter (OTC) items, no prescription is required.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Delivery usually takes 1-3 business days depending on your location.',
  },
  {
    question: 'Is Kloud Pharma a licensed pharmacy?',
    answer:
      'Yes, Kloud Pharma is a fully licensed and certified pharmacy that follows all regulatory guidelines.',
  },
  {
    question: 'Can I pay cash on delivery (COD)?',
    answer:
      'Yes, we offer cash on delivery for eligible locations and orders.',
  },
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const contentRefs = useRef([]);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="md:max-w-3xl w-full mx-auto  mt-10 md:mt-20">
      <h1 className="text-center font-semibold sm:mb-6 mb-2 text-[#00243F] tracking-wide md:text-lg">
        Frequently Asked Questions (FAQs)
      </h1>

      <div className="mt-6 space-y-2 cursor-pointer">
        {faqs.map((faq, index) => (
          <div key={index} className="text-xs tracking-wider font-medium">
            {openIndex === index && <div className="border-t border-gray-300"></div>}

            <button
              onClick={() => toggleFAQ(index)}
              className={`flex justify-between items-center w-full text-left px-6 py-5 transition-all duration-300 ${openIndex === index
                ? 'bg-[#0070BA]/80 text-white rounded-t-md'
                : 'text-[#00243F] font-semibold border-b border-gray-300'
                }`}
            >
              <span>
                {index + 1}. {faq.question}
              </span>
              <i
                className={`ri-${openIndex === index ? 'subtract-line' : 'add-line'} text-lg cursor-pointer`}
              ></i>
            </button>


            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className={`transition-all duration-500 ease-in-out overflow-hidden bg-[#0070BA]/80 px-6 mb-6 text-white text-xs rounded-b-md`}
              style={{
                maxHeight:
                  openIndex === index
                    ? contentRefs.current[index]?.scrollHeight + 'px'
                    : '0px',
                paddingBottom: openIndex === index ? '4rem' : '0px',
              }}
            >
              {faq.answer}
            </div>

          </div>
        ))}
      </div>
      <div className='flex justify-center md:mt-6 mt-2'>
        <button
          className="text-[10px] font-normal bg-[#0070BA] rounded-full text-white cursor-pointer sm:py-2 py-1.5 px-6 sm:px-5"
        >
          View More
          <i className="ri-arrow-right-s-line"></i>
        </button>
      </div>
    </div>
  );
};

export default Faq;