import React from "react";
import { FaPills, FaCapsules, FaFileInvoice, FaUser } from "react-icons/fa";

const data = [
  {
    id: 1,
    icon: <FaPills />,
    title: "Medicine",
    qty: 120,
  },
  {
    id: 2,
    icon: <FaCapsules />,
    title: "OTC",
    qty: 80,
  },
  {
    id: 3,
    icon: <FaFileInvoice />,
    title: "Invoices",
    qty: 45,
  },
  {
    id: 4,
    icon: <FaUser />,
    title: "Users",
    qty: 60,
  },
];

const Card = () => {
  return (
    <div className=" mx-3 md:mx-5 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 md:gap-7 gap-3 ">
      {data.map(({ id, icon, title, qty }) => (
        <div
          key={id}
          className="card flex items-center justify-evenly p-4 bg-white rounded-lg shadow-md"
        >
          <div className="text-highlight md:text-5xl text-2xl">{icon}</div>
          <div className="flex flex-col items-center">
            <h2 className="mt-4 md:text-xl font-semibold">{title}</h2>
            <p className="text-highlight font-medium">Quantity: {qty}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
