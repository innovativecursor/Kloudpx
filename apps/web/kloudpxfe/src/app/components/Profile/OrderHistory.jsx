"use client";

import React, { useState } from "react";
import { Pagination, Modal } from "antd";
import "antd/dist/reset.css";
import Image from "next/image";

const allOrders = Array.from({ length: 20 }, (_, i) => ({
  orderNumber: `XYT3456${222 + i}`,
  transactionId: `UTI8945${55 + i}`,
  customerName: `Customer ${i + 1}`,
  status: i % 2 === 0 ? "Partially Paid" : "Paid",
  orderDate: "26 Jul, 25",
  paymentType: "Credit Card",
  items: [
    {
      name: "Sugar free gold",
      price: 220,
      quantity: 1,
      category: "Supplements, Vitamins",
      image: "/product1.png",
    },
    {
      name: "Sugar free gold",
      price: 180,
      quantity: 2,
      category: "Supplements, Vitamins",
      image: "/product2.png",
    },
  ],
  deliveryCharge: 220,
  offerDiscount: 220,
  gst: "12%",
  total: 220,
}));

const statusOptions = ["Paid", "Partially Paid", "Pending"];

const OrderHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const fallbackImage = "/assets/fallback.png";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const paginatedOrders = allOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleStatusChange = (index, newStatus) => {
    const updated = [...paginatedOrders];
    updated[index].status = newStatus;
    const globalIndex = (currentPage - 1) * pageSize + index;
    allOrders[globalIndex] = updated[index];
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-3xl my-16 bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full table-auto text-left">
        <thead className="bg-[#0070ba] text-sm font-light text-white">
          <tr>
            <th className="py-5 px-6">Order Number</th>
            <th className="py-5 px-6">Transaction ID</th>
            <th className="py-5 px-6">Customer Name</th>
            <th className="py-5 px-6">Status</th>
          </tr>
        </thead>
        <tbody>
          {paginatedOrders.map((order, index) => (
            <tr
              key={order.orderNumber}
              onClick={() => openModal(order)}
              className="border-b border-gray-100 cursor-pointer font-light hover:bg-gray-50 text-sm transition"
            >
              <td className="py-5 px-6">{order.orderNumber}</td>
              <td className="py-5 px-6">{order.transactionId}</td>
              <td className="py-5 px-6">{order.customerName}</td>
              <td className="py-5 px-6">
                <select
                  value={order.status}
                  onClick={(e) => e.stopPropagation()} // Prevent modal on dropdown click
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                  className="bg-blue-50 text-blue-900 py-1 px-3 rounded-lg cursor-pointer focus:outline-none"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-sm text-gray-600">
          Showing {(currentPage - 1) * pageSize + 1} -{" "}
          {Math.min(currentPage * pageSize, allOrders.length)} of{" "}
          {allOrders.length} records
        </div>
        <Pagination
          current={currentPage}
          total={allOrders.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
        />
      </div>

      {/* MODAL */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={900}
      >
        {selectedOrder && (
          <div className="p-4">
            <div className="shadow">
              <h2 className="text-xl font-semibold mb-1">
                {selectedOrder.customerName}
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                {selectedOrder.orderNumber}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              {/* Product Details */}

              <div>
                <div className="bg-[#EDF4F6] w-full rounded-lg py-5">
                  <div className="flex  font-semibold text-black px-6 py-3 items-center text-lg ">
                    Product Details
                  </div>
                  <div className="flex items-center gap-4 md:py-6 px-10 shadow-xs transition">
                    <div>
                      <img
                        src={fallbackImage}
                        alt="product"
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                          <p className="text-sm font-light text-[#0070ba]">
                            Supplements Vitamins
                          </p>
                          <h4 className="font-medium text-base mb-1">
                            Sugar Free Gold
                          </h4>
                        </div>
                        <button
                          //   onClick={() => handleDelete(item.cart_id)}
                          className="ml-2 cursor-pointer font-light text-gray-400"
                          title="Remove"
                        >
                          <i className="ri-close-circle-line text-2xl font-light"></i>
                        </button>
                      </div>

                      <div className="text-base mt-2 font-medium text-[#333]">
                        <p className="text-sm font-semibold text-[#333]">
                          ₱220
                        </p>
                      </div>
                      <span className="text-xs">Quantity: 3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Billing Details</h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Order date</span>
                    <span>{selectedOrder.orderDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Type</span>
                    <span>{selectedOrder.paymentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Item</span>
                    <span>₱{selectedOrder.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery charge</span>
                    <span>₱{selectedOrder.deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Offer discount</span>
                    <span>₱{selectedOrder.offerDiscount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST</span>
                    <span>{selectedOrder.gst}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold text-md">
                    <span>Total amount</span>
                    <span>₱{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
