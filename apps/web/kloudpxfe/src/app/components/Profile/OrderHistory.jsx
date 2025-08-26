"use client";

import React, { useEffect, useState } from "react";
import { Pagination, Modal, Spin } from "antd";
import "antd/dist/reset.css";
import { useProfileContext } from "@/app/contexts/ProfileContext";

const OrderHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const fallbackImage = "/assets/fallback.png";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { getAllOrder, allOrder, getOrderDetails, selectedOrder } =
    useProfileContext();

  useEffect(() => {
    getAllOrder();
  }, []);

  const paginatedOrders = Array.isArray(allOrder)
    ? allOrder.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const openModal = async (order) => {
    setIsModalOpen(true);
    setLoadingDetails(true);
    await getOrderDetails(order.order_number);
    setLoadingDetails(false);
  };

  console.log(selectedOrder, "shdka");

  return (
    <div className="max-w-4xl my-16 bg-white rounded-lg shadow overflow-hidden mx-auto">
      {/* Orders Table */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
        <table className="md:min-w-[700px] w-full text-left">
          <thead className="bg-[#0070ba] sm:text-sm text-xs font-light text-white">
            <tr>
              <th className="py-5 px-6">Order Number</th>
              <th className="py-5 px-6">Shipping Number</th>
              <th className="py-5 px-6">Customer Name</th>
              <th className="py-5 px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.order_number}
                onClick={() => openModal(order)}
                className="border-b border-gray-100 cursor-pointer font-light hover:bg-gray-50 text-sm transition"
              >
                <td className="py-5 px-6">{order.order_number}</td>
                <td className="py-5 px-6">{order.shipping_number || "-"}</td>
                <td className="py-5 px-6">{order.customer_name || "-"}</td>
                <td className="py-5 px-6">{order.order_status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 text-sm gap-2">
        <div className="text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(currentPage * pageSize, allOrder.length)} of{" "}
          {allOrder.length} records
        </div>
        <Pagination
          current={currentPage}
          total={allOrder.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
      >
        {loadingDetails ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : selectedOrder ? (
          <div className="p-2 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-1">
              {selectedOrder.customer_name || "Customer Name"}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Order #: {selectedOrder.order_number}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Shipping Address: {selectedOrder.delivery_address || "-"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-10">
              {/* Product Details */}
              <div>
                <div className="bg-[#EDF4F6] rounded-lg py-4 px-4 sm:px-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">
                    Product Details
                  </h3>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-row items-start sm:items-center gap-4 mb-4 transition"
                      >
                        <img
                          src={item.image || fallbackImage}
                          alt={item.medicine_name || "Product"}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 text-sm sm:text-base">
                          <h4 className="font-semibold">
                            {item.medicine_name}
                          </h4>
                          <p>Price: ₱{item.price}</p>
                          <p>Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No items in this order.</p>
                  )}
                </div>
              </div>

              {/* Billing Details */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-4">
                  Billing Details
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Order date</span>
                    <span>{selectedOrder.created_at || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Type</span>
                    <span>{selectedOrder.payment_type || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paid Amount</span>
                    <span>₱{selectedOrder.paid_amount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Type</span>
                    <span>{selectedOrder.delivery_type || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Number</span>
                    <span>{selectedOrder.shipping_number || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Status</span>
                    <span>{selectedOrder.order_status || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remark</span>
                    <span>{selectedOrder.remark || "-"}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₱{selectedOrder.grand_total || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-16">No order details found.</p>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
