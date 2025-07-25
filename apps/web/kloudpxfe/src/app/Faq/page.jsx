"use client";

import Faq from "@/app/components/FaqData/Faq";
import { faqData } from "../components/FaqData/FaqData";

const FaqPage = () => {
  return (
    <div className="mt-40 md:mt-64 sm:mt-48">
      <Faq data={faqData} showAll={true} />
    </div>
  );
};

export default FaqPage;
