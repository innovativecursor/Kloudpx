import React, { useEffect } from "react";
import { useOrderContext } from "../contexts/OrderContext";

const AllOrders = () => {
  const { getAllOrders, allOrders } = useOrderContext();

  useEffect(() => {
    if (!allOrders || allOrders.length === 0) {
      getAllOrders();
    }
  }, []);

  return (
    <div className="md:p-4 mt-16 mx-[4vw]">
      <h1 className="text-3xl text-[#0070ba] font-bold text-center mb-6">
        All Orders
      </h1>

      <div className="overflow-x-auto mb-20 bg-white shadow-lg rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-[#0070ba] text-white text-xs sm:text-sm">
            <tr>
              <th className="px-4 py-4 text-left">#</th>
              <th className="px-4 py-4 text-left">Order ID</th>
              <th className="px-4 py-4 text-left">Customer</th>
              <th className="px-4 py-4 text-left">Amount</th>
              <th className="px-4 py-4 text-left">Payment No</th>
              <th className="px-4 py-4 text-left">Delivery</th>
              <th className="px-4 py-4 text-left">Status</th>
              <th className="px-4 py-4 text-left">Date</th>
              <th className="px-4 py-4 text-left">Address</th>
            </tr>
          </thead>
          <tbody>
            {allOrders?.map((order, index) => (
              <tr
                key={order.order_number || index}
                className="border-b cursor-pointer hover:bg-gray-100 transition duration-150"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 break-words max-w-[150px] text-[#0070ba]">
                  {order.order_number}
                </td>
                <td className="px-4 py-3">{order.customer_name}</td>
                <td className="px-4 py-3 font-semibold">
                  ₹{order.amount_paid}
                </td>
                <td className="px-4 py-3">{order.payment_number}</td>
                <td className="px-4 py-3 capitalize">{order.delivery_type}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      order.status === "processing"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 break-words max-w-[200px]">
                  {order.delivery_address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {allOrders?.length === 0 && (
          <div className="p-6 text-center text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
