"use client";

import { createContext, useContext, useState } from "react";
import { updateAxiosCall, postAxiosCall } from "../lib/axios";
import endpoints from "../config/endpoints";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
    const [savedForLaterIds, setSavedForLaterIds] = useState([]);
    const [checkoutData, setCheckoutData] = useState([]);

    const toggleSaveForLater = async (cartId) => {
        try {
            const res = await updateAxiosCall(
                endpoints.cart.saveForLater,
                cartId,
                {},
                true
            );
            console.log(res);

            const isSaved = res.save_for_later;

            setSavedForLaterIds((prev) => {
                if (isSaved) {
                    if (!prev.includes(cartId)) return [...prev, cartId];
                    return prev;
                } else {
                    return prev.filter((id) => id !== cartId);
                }
            });

            return isSaved;
        } catch (error) {
            console.error("Error toggling save for later:", error);
        }
    };

    const doCheckout = async () => {
        try {
            const res = await postAxiosCall(endpoints.checkout.get, {}, true);
            // console.log("Checkout success:", res);
            setCheckoutData(res || []);
        } catch (error) {
            setCheckoutData([]);

        }
    }



    return (
        <CheckoutContext.Provider value={{ toggleSaveForLater, savedForLaterIds, doCheckout, checkoutData }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => useContext(CheckoutContext);
