"use client";

import React, { useState, useEffect } from "react";
import { Pagination, Modal, Spin } from "antd";
import { useProfileContext } from "@/app/contexts/ProfileContext";

const OrderHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const fallbackImage = "/assets/fallback.png";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const { getAllOrder, allOrder, getOrderDetails, selectedOrder } =
    useProfileContext();

  useEffect(() => {
    getAllOrder();
  }, []);

  const paginatedOrders = Array.isArray(allOrder)
    ? [...allOrder]
        .reverse()
        .slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : [];

  const openModal = async (order) => {
    setIsModalOpen(true);
    setLoadingDetails(true);
    await getOrderDetails(order.order_number);
    setLoadingDetails(false);
  };

  return (
    <div className="order-history-page  bg-white rounded-lg shadow overflow-hidden mx-auto not-prose">
      <h2 className="text-2xl md:text-start text-center font-semibold mb-4">
        All Orders
      </h2>
      {/* Orders Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[700px] w-full text-left border-collapse">
          <thead className="bg-[#0070ba] text-white text-sm">
            <tr>
              <th className="py-3 px-4">Order Number</th>
              <th className="py-3 px-4">Shipping Number</th>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.order_number}
                onClick={() => openModal(order)}
                className="border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition text-gray-700 text-sm"
              >
                <td className="py-3 px-4">{order.order_number}</td>
                <td className="py-3 px-4">{order.shipping_number || "-"}</td>
                <td className="py-3 px-4">{order.customer_name || "-"}</td>
                <td className="py-3 px-4">{order.status || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 text-sm gap-2 text-gray-600">
        <div>
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
        className="order-history-modal"
      >
        {loadingDetails ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : selectedOrder ? (
          <div className="md:p-4">
            <h2 className="text-lg font-semibold mb-1 text-gray-800">
              {selectedOrder.customer_name || "Customer Name"}
            </h2>
            <p className="text-sm text-gray-500 mb-2">
              Order #: {selectedOrder.order_number}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Shipping Address: {selectedOrder.delivery_address || "-"}
            </p>

            <div className="grid cursor-pointer grid-cols-1 md:grid-cols-2 md:gap-4 gap-6 mt-6">
              {/* Product Details */}
              <div>
                <div className="bg-gray-100 rounded-lg p-4  md:max-h-80 max-h-52 overflow-y-auto thin-scrollbar">
                  <h3 className="text-base font-semibold mb-4 text-gray-800">
                    Product Details
                  </h3>
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start sm:items-center gap-4 mb-4"
                      >
                        <img
                          src={item.image || fallbackImage}
                          alt={item.medicine_name || "Product"}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1 text-sm sm:text-base text-gray-700">
                          <h4 className="font-semibold">
                            {item.medicine_name}
                          </h4>
                          <p>Price: ₱{item.price}</p>
                          <p>Qty: {item.quantity}</p>
                          <p>{item.pharmacist_status}</p>
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
                <h3 className="text-base font-semibold mb-4 text-gray-800">
                  Billing Details
                </h3>
                <div className="text-sm space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Order date</span>
                    <span>{selectedOrder.created_at || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Type</span>
                    <span>{selectedOrder.payment_type || "-"}</span>
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

                  <hr className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₱{(selectedOrder.grand_total || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center py-16 text-gray-500">
            No order details found.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory;
