import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import Title from "../Titles/Title";

const filterSections = [
  {
    title: "Shop by Category",
    items: [
      "Medicines",
      "Personal Care",
      "Healthcare Devices",
      "Baby",
      "Herbs",
      "Vitamins",
    ],
  },
  {
    title: "Refined By",
    items: ["Brand", "Color", "Price"],
  },
];

const AccordionItem = ({ label, isOpen, toggleOpen }) => (
  <div
    onClick={toggleOpen}
    className="flex justify-between items-center cursor-pointer py-3 border-b border-gray-200"
  >
    <span className="text-sm font-normal text-gray-800">{label}</span>
    <IoIosArrowDown
      className={`transform transition-transform duration-200 text-sm text-gray-500 ${
        isOpen ? "rotate-180" : ""
      }`}
    />
  </div>
);

const ProductsFilter = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (label) => {
    setOpenSections((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className="w-full md:w-[20%] hidden md:block sticky top-4">
      {filterSections.map((section, idx) => (
        <div key={idx} className="mb-4">
          <Title text={section.title} />
          {section.items.map((item, index) => (
            <AccordionItem
              key={index}
              label={item}
              isOpen={!!openSections[item]}
              toggleOpen={() => toggleSection(item)}
            />
          ))}
        </div>
      ))}
    </aside>
  );
};

export default ProductsFilter;
