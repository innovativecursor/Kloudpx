"use client";
import { createContext, useContext, useState } from "react";
import { useCheckout } from "./CheckoutContext";
import { postAxiosCall } from "../lib/axios";
import endpoints from "../config/endpoints";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [gcashNumber, setGcashNumber] = useState("");
    const [amountPaid, setAmountPaid] = useState("");
    const [orderSuccess, setOrderSuccess] = useState([]);
    const { checkoutData, deliveryData } = useCheckout();
    const router = useRouter();

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
        const isCOD = deliveryData?.delivery_type === "cod";

        console.log("isCOD:", isCOD);

        const payload = isCOD
            ? { checkout_session_id: String(checkoutData?.checkout_session_id) }
            : {
                checkout_session_id: String(checkoutData?.checkout_session_id),
                payment_number: gcashNumber,
                remark: String(amountPaid),
                screenshot_base64: selectedFile,
            };

        console.log(payload);

        // Validation
        if (!payload.checkout_session_id && !payload.checkout_sessionid) {
            toast.error("Checkout session ID is missing.");
            return;
        }

        if (!isCOD) {
            if (!amountPaid || isNaN(amountPaid)) {
                toast.error("Please enter a valid amount.");
                return;
            }
            if (!gcashNumber && !selectedFile) {
                toast.error("Please provide either payment number or screenshot.");
                return;
            }
        }
        try {
            const res = await postAxiosCall(
                endpoints.paymentSubmit.add,
                payload,
                true
            );
            setOrderSuccess(res || []);
            toast.success("Payment submitted successfully!");
            router.push("/Success");

            if (!isCOD) {
                setGcashNumber("");
                setAmountPaid("");
                setSelectedFile(null);
            }
        } catch (error) {
            toast.error("Something went wrong!");
            setOrderSuccess([]);
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
                handleSubmit,
                orderSuccess,
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);
