"use client";
import { createContext, useContext, useState } from "react";
import { useCheckout } from "./CheckoutContext";
import { getAxiosCall, postAxiosCall } from "../lib/axios";
import endpoints from "../config/endpoints";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCartContext } from "./CartContext";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [gcashNumber, setGcashNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [orderSuccess, setOrderSuccess] = useState([]);
  const {
    checkoutData,
    deliveryData,
    setCheckoutData,
    setDeliveryData,
    paymentMethod,
    addDeliveryData,
    doCheckout,
  } = useCheckout();
  const [OrderSubmit, setOrderSubmit] = useState([]);
  const [paymentSlip, setPaymentSlip] = useState([]);
  const { getAllCartData } = useCartContext();
  const router = useRouter();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const fullBase64 = reader.result;
      const base64String = reader.result.split(",")[1];
      setSelectedFile(base64String);
      setPreviewImage(fullBase64);
      // getPaymentSlip();
    };
    reader.readAsDataURL(file);
  };

  const getPaymentSlip = async () => {
    try {
      const res = await getAxiosCall(endpoints.paymentslip.get, {}, true);
      console.log(res);

      setPaymentSlip(res?.data?.screenshot_url || []);
    } catch (error) {
      setPaymentSlip([]);
    }
  };

  const handleOrderSubmit = async () => {
    if (!paymentMethod) {
      toast.error("Checkout session ID is missing.");
      return;
    }

    try {
      await doCheckout();

      await addDeliveryData();

      const res = await postAxiosCall(
        endpoints.OrderSubmit.add,
        {
          checkout_session_id: checkoutData?.checkout_session_id,
          payment_type: paymentMethod,
        },
        true
      );
      setOrderSubmit(res || [])
      toast.success("Payment submitted successfully!");
      router.push("/Success");
      getAllCartData();
      setCheckoutData(null);
      setDeliveryData(null);
    } catch (error) {
      console.error("Error submitting order:", error.message);
      toast.error("Something went wrong!");
      setOrderSubmit([])
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        handleFileChange,
        selectedFile,
        setSelectedFile,
        gcashNumber,
        setGcashNumber,
        amountPaid,
        setAmountPaid,

        orderSuccess,
        getPaymentSlip,
        paymentSlip,
        previewImage,
        handleOrderSubmit,
        OrderSubmit,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
