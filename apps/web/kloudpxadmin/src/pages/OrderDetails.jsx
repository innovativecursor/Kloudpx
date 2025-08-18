import React, { useEffect, useState } from "react";
import { useOrderContext } from "../contexts/OrderContext";
import { useParams } from "react-router-dom";

const OrderDetails = () => {
  const { orderDetails, getOrderDetails, updateOrder } = useOrderContext();
  const { id } = useParams();

  const [status, setStatus] = useState("");
  const [amountPay, setAmountPay] = useState();
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

      // Save original values for comparison
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

  console.log(orderDetails);

  const handleSave = async () => {
    const payload = {
      status,
      paid_amount: parseFloat(amountPay) || 0,
      shipping_number: transactionId || "",
    };
    await updateOrder(id, payload);
  };

  // Check if any value is changed
  const isChanged =
    status !== originalValues.status ||
    parseFloat(amountPay) !== parseFloat(originalValues.amountPay) ||
    transactionId !== originalValues.transactionId;

  return (
    <div className="md:p-6 mt-16 mx-[4vw]">
      <h1 className="text-3xl md:text-4xl text-blue-600 font-bold text-center mb-10">
        Order Details
      </h1>

      <div className="bg-white mb-32 rounded-lg shadow-md">
        <div className="p-6 border-b">
          {/* Medicines List */}
          <div className="space-y-3 mb-6">
            {orderDetails.items?.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center justify-between border p-4 rounded-lg hover:shadow-lg transition"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-lg md:text-xl">
                    {item?.medicine_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Quantity: {item?.quantity}
                  </p>
                  <p className="text-sm text-gray-500">Price: ₱{item?.price}</p>
                  <p className="text-sm text-gray-500">
                    Clinic Name: {item?.clinic_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Doctor Name : {item?.doctor_name}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm mt-2 md:mt-0 font-medium ${
                    item.pharmacist_status === "approved"
                      ? "bg-green-100 text-green-700"
                      : item.pharmacist_status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item?.pharmacist_status
                    ? item.pharmacist_status.charAt(0).toUpperCase() +
                      item.pharmacist_status.slice(1).toLowerCase()
                    : ""}
                </span>
              </div>
            ))}
          </div>

          {/* Status + Amount + Transaction + Save */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-4">
            <div>
              <label className="font-semibold block mb-1">Status</label>
              <select
                className="border rounded-lg px-3 py-2 w-full md:w-40 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="processing">Processing</option>
                <option value="transit">Transit</option>
                <option value="shipped">Shipped</option>
                <option value="success">Success</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="font-semibold block mb-1">Amount Pay</label>
              <input
                type="number"
                placeholder="Enter Amount"
                value={amountPay}
                onChange={(e) => setAmountPay(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full md:w-40 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Delivery ID</label>
              <input
                type="text"
                placeholder="Transaction Id"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full md:w-60 bg-blue-50 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="self-end md:self-center">
              <button
                className={`px-6 py-2 rounded-lg transition ${
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
        </div>

        {/* Bottom: Order & Billing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="bg-white rounded-lg shadow-inner p-6">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Order Details
            </h2>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Booking Id:</span>{" "}
                {orderDetails.order_number}
              </p>
              <p>
                <span className="font-semibold">Booking Date:</span>{" "}
                {/* {orderDetails.created_at} */}
                {(() => {
                  const utcDate = new Date(orderDetails.created_at);
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
              </p>

              <p>
                <span className="font-semibold">Delivery Type:</span>{" "}
                {orderDetails.delivery_type}
              </p>
              <p>
                <span className="font-semibold">Payment Type :</span>{" "}
                {orderDetails.payment_type}
              </p>
              <p>
                <span className="font-semibold">Order Status :</span>{" "}
                {orderDetails.order_status}
              </p>

              <p>
                <span className="font-semibold">Customer Name:</span>{" "}
                {orderDetails.customer_name}
              </p>
              <p>
                <span className="font-semibold">Phone Number:</span>{" "}
                {orderDetails.phone_number}
              </p>
              <p>
                <span className="font-semibold">Delivery Address:</span>{" "}
                {orderDetails.delivery_address}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-inner p-6">
            <h3 className="font-semibold mb-3 border-b pb-2">
              Billing Details
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
              <p className="flex justify-between">
                <span>Payable Amount</span>{" "}
                <span>₱{parseFloat(orderDetails.grand_total).toFixed(2)}</span>
              </p>
              <p className="flex justify-between">
                <span>Total Amount</span>{" "}
                <span>₱{parseFloat(orderDetails.grand_total).toFixed(2)}</span>
              </p>
              <hr className="border-blue-200 my-2" />
              <p className="flex justify-between font-semibold">
                <span>Total amount</span>{" "}
                <span>₱{parseFloat(orderDetails.grand_total).toFixed(2)}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
