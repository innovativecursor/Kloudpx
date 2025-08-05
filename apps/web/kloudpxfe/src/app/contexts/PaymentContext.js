"use client";
import { createContext, useContext, useState } from "react";
import { useCheckout } from "./CheckoutContext";
import { postAxiosCall } from "../lib/axios";
import endpoints from "../config/endpoints";
import toast from "react-hot-toast";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [gcashNumber, setGcashNumber] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const { checkoutData } = useCheckout()

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        const cleanedBase64 = selectedFile?.split(",")[1];

        const payload = {
            checkout_session_id: String(checkoutData?.checkout_session_id),
            payment_number: gcashNumber.trim(),
            amount_paid: parseFloat(amountPaid).toFixed(2),
            screenshot_base64: cleanedBase64,
        };

        if (
            !payload.checkout_session_id ||
            !payload.amount_paid ||
            !payload.screenshot_base64
        ) {
            toast.error("Please fill all fields correctly.");
            return;
        }
        console.log(payload);

        try {
            const res = await postAxiosCall(endpoints.paymentSubmit.add, payload, true);
            toast.success("Payment submitted successfully!");
        } catch (error) {
            toast.error("Something went wrong!");
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
                handleSubmit
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);
