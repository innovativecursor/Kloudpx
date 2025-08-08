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
    const { checkoutData, deliveryData } = useCheckout();
    const [paymentSlip, setPaymentSlip] = useState([])
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

            setPaymentSlip(res?.data?.screenshot_url
                || []);
        } catch (error) {
            setPaymentSlip([]);
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
            console.log(res);

            setOrderSuccess(res || []);
            toast.success("Payment submitted successfully!");
            getAllCartData();
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
                getPaymentSlip,
                paymentSlip,
                previewImage
            }}
        >
            {children}
        </PaymentContext.Provider>
    );
};

export const usePayment = () => useContext(PaymentContext);
