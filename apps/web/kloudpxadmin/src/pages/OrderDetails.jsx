"use client";

import React, { useEffect, useState } from "react";
import { useOrderContext } from "../contexts/OrderContext";
import { useParams } from "react-router-dom";
import { FiUser, FiPackage, FiCreditCard } from "react-icons/fi";

const OrderDetails = () => {
  const { orderDetails, getOrderDetails, updateOrder } = useOrderContext();
  const { id } = useParams();

  const [status, setStatus] = useState("");
  const [amountPay, setAmountPay] = useState(0);
  const [transactionId, setTransactionId] = useState("");

  const [originalValues, setOriginalValues] = useState({
    status: "",
    amountPay: 0,
    transactionId: "",
  });

  useEffect(() => {
    getOrderDetails(id);
  }, [id]);

  useEffect(() => {
    if (orderDetails?.order_number === id) {
      const initStatus = orderDetails.order_status || "";
      const initAmount = orderDetails.paid_amount || 0;
      const initTransaction = orderDetails.shipping_number || "";

      setStatus(initStatus);
      setAmountPay(initAmount);
      setTransactionId(initTransaction);

      setOriginalValues({
        status: initStatus,
        amountPay: initAmount,
        transactionId: initTransaction,
      });
    }
  }, [orderDetails, id]);

  if (!orderDetails) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading order details...
      </p>
    );
  }

  const handleSave = async () => {
    const payload = {
      status,
      paid_amount: parseFloat(amountPay) || 0,
      shipping_number: transactionId || "",
    };
    await updateOrder(id, payload);
  };

  const isChanged =
    status !== originalValues.status ||
    parseFloat(amountPay) !== parseFloat(originalValues.amountPay) ||
    transactionId !== originalValues.transactionId;

  const { customer_details: customer } = orderDetails;

  // Safely handle numeric values
  const grandTotal = parseFloat(orderDetails.grand_total || 0).toFixed(2);
  const deliverycost = parseFloat(orderDetails.delivery_cost || 0).toFixed(2);
  const pwdDiscount = parseFloat(orderDetails.pwd_discount || 0).toFixed(2);
  const seniorDiscount = parseFloat(orderDetails.senior_discount || 0).toFixed(
    2
  );

  return (
    <div className="md:p-6 mt-16 mx-[4vw] mb-32">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-12">
        Order Details
      </h1>

      {/* Items Section */}
      <div className="bg-white shadow-lg rounded-xl mb-8 p-6">
        <h2 className="text-xl font-semibold mb-6 border-b pb-2">
          🛒 Ordered Items
        </h2>
        <div className="space-y-4">
          {orderDetails.items?.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row md:items-center justify-between border p-4 rounded-lg hover:shadow-md transition bg-gray-50"
            >
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-lg">{item?.medicine_name}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {item?.quantity || 0}
                </p>
                <p className="text-sm text-gray-500">
                  Price: ₱{item?.price || 0}
                </p>
                <p className="text-sm text-gray-500">
                  Clinic: {item?.clinic_name || "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Doctor: {item?.doctor_name || "N/A"}
                </p>
              </div>
              {item?.pharmacist_status && (
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium mt-2 md:mt-0 ${
                    item.pharmacist_status === "approved"
                      ? "bg-green-100 text-green-700"
                      : item.pharmacist_status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.pharmacist_status.charAt(0).toUpperCase() +
                    item.pharmacist_status.slice(1).toLowerCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editable Fields: Status / Delivery / Amount */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 flex flex-col md:flex-row md:items-end gap-7">
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Status</label>
          <select
            className="border rounded-lg px-3 h-10 w-full md:w-60 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="success">Success</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold mb-1">Delivery ID</label>
          <input
            type="text"
            placeholder="Delivery ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="border rounded-lg px-3 h-10 w-full md:w-60 bg-blue-50 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="mt-4 md:mt-0">
          <button
            className={`px-3 h-10 w-60 rounded-lg transition ${
              isChanged
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleSave}
            disabled={!isChanged}
          >
            Save & Send
          </button>
        </div>
      </div>

      {/* Customer + Order + Billing Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="bg-white shadow-inner rounded-xl p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-4">
            <FiUser className="text-blue-500 text-xl" />
            <h3 className="font-semibold text-lg">Customer Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Name:</span>{" "}
              {customer?.FirstName || ""} {customer?.LastName || ""}
            </p>
            <p>
              <span className="font-semibold">Email:</span>{" "}
              {customer?.Email || ""}
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              {customer?.Phone || ""}
            </p>
            <p>
              <span className="font-semibold">Age:</span>{" "}
              {customer?.Age || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Gender:</span>{" "}
              {customer?.Gender || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Role:</span>{" "}
              {customer?.ApplicationRole || "N/A"}
            </p>
          </div>
        </div>

        {/* Order Info */}
        <div className="bg-white shadow-inner rounded-xl p-6 border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-4">
            <FiPackage className="text-green-500 text-xl" />
            <h3 className="font-semibold text-lg">Order Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">Booking ID:</span>{" "}
              {orderDetails.order_number || ""}
            </p>
            <p>
              <span className="font-semibold">Booking Date:</span>{" "}
              {orderDetails.created_at
                ? new Date(orderDetails.created_at + "Z").toLocaleString(
                    "en-PH",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )
                : "N/A"}
            </p>
            <p>
              <span className="font-semibold">Delivery Type:</span>{" "}
              {orderDetails?.delivery_type || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Payment Type:</span>{" "}
              {orderDetails?.payment_type || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Order Status:</span>{" "}
              {orderDetails?.order_status || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Delivery Address:</span>{" "}
              {orderDetails?.delivery_address || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Phone No: </span>{" "}
              {orderDetails?.phone_number || "N/A"}
            </p>
          </div>
        </div>

        {/* Billing Info */}
        <div className="bg-white shadow-inner rounded-xl p-6 border-l-4 border-purple-500 ">
          <div className="flex items-center gap-2 mb-4">
            <FiCreditCard className="text-purple-500 text-xl" />
            <h3 className="font-semibold text-lg">Billing Details</h3>
          </div>
          <div className="flex justify-between items-center ">
            <label className="font-semibold mb-1">Amount Paid</label>
            <input
              type="number"
              placeholder="Enter Amount"
              value={amountPay}
              onChange={(e) => setAmountPay(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full md:w-40 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="space-y-2 text-sm">
            {/* <p className="flex justify-between mt-2">
              <span>Payable Amount:</span> <span>₱{grandTotal}</span>
            </p> */}
            <p className="flex justify-between">
              <span>Delivery Cost:</span> <span>₱{deliverycost}</span>
            </p>
            <p className="flex justify-between">
              <span>PWD Discount:</span> <span>₱{pwdDiscount}</span>
            </p>
            <p className="flex justify-between">
              <span>Senior Discount:</span> <span>₱{seniorDiscount}</span>
            </p>
            <hr className="border-gray-200 my-2" />
            <p className="flex justify-between font-semibold">
              <span>Total Amount:</span> <span>₱{grandTotal}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
