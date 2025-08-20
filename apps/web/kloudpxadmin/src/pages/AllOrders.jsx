import React, { useEffect, useState } from "react";
import { useOrderContext } from "../contexts/OrderContext";
import { useNavigate } from "react-router-dom";

const AllOrders = () => {
  const { getAllOrders, allOrders } = useOrderContext();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 15;

  useEffect(() => {
    if (!allOrders || allOrders.length === 0) {
      getAllOrders();
    }
  }, []);

  console.log(allOrders);

  // Pagination logic

  const reversedOrders = allOrders ? [...allOrders].reverse() : [];
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = reversedOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  const totalPages = allOrders
    ? Math.ceil(allOrders.length / ordersPerPage)
    : 0;

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="md:p-6 mt-16 mx-[4vw]">
      <h1 className="text-3xl md:text-4xl text-[#0070ba] font-bold text-center mb-8">
        All Orders
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-[#0070ba] text-white">
            <tr>
              <th className="px-4 py-5 text-left text-sm md:text-base font-medium">
                #
              </th>
              <th className="px-4 py-5 text-left text-sm md:text-base font-medium">
                Order ID
              </th>
              <th className="px-4 py-5 text-left text-sm md:text-base font-medium">
                Customer
              </th>
              <th className="px-4 py-5 text-left text-sm md:text-base font-medium">
                Delivery
              </th>
              <th className="px-4 py-5 text-left text-sm md:text-base font-medium">
                Status
              </th>
              <th className="px-4 py-5 text-left text-sm md:text-base font-medium">
                Date
              </th>
              <th className="px-4 py-5 text-left text-sm md:text-base font-medium">
                Address
              </th>
              <th className="px-4 py-5 text-left text-sm md:text-base font-medium">
                Phone No
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders?.map((order, index) => (
              <tr
                key={order.order_number || index}
                className="hover:bg-gray-50 transition duration-200 cursor-pointer"
                onClick={() => navigate(`/ordersdetails/${order.order_number}`)}
              >
                <td className="px-4 py-5 text-sm md:text-base">
                  {indexOfFirstOrder + index + 1}
                </td>
                <td className="px-4 py-5 max-w-[150px] text-[#0070ba] text-sm md:text-base break-words font-medium">
                  {order.order_number}
                </td>
                <td className="px-4 py-5 text-sm md:text-base">
                  {order.customer_name}
                </td>
                <td className="px-4 py-5 text-sm md:text-base capitalize">
                  {order.delivery_type}
                </td>
                <td className="px-4 py-5">
                  <span
                    className={`px-3 py-1 rounded-full uppercase text-xs md:text-sm font-semibold ${
                      order.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "transit"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "success"
                        ? "bg-green-100 text-green-800"
                        : order.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="px-4 py-5 text-sm md:text-base whitespace-nowrap">
                  {(() => {
                    const utcDate = new Date(order.created_at);
                    utcDate.setHours(utcDate.getHours() + 8);
                    return utcDate.toLocaleString("en-PH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  })()}
                </td>

                <td className="px-4 py-5 text-sm md:text-base max-w-[250px] break-words">
                  {order.delivery_address}
                </td>
                <td className="px-4 py-5 text-sm md:text-base max-w-[250px] break-words">
                  {order.phone_number}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allOrders?.length === 0 && (
          <div className="p-6 text-center text-gray-500 text-sm md:text-base">
            No orders found.
          </div>
        )}

        {/* Pagination Controls */}
        {allOrders?.length > ordersPerPage && (
          <div className="flex justify-center items-center mt-4 space-x-4">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm md:text-base">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
