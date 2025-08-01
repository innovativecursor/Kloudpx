"use client";

import { createContext, useContext, useState } from "react";
import { updateAxiosCall, postAxiosCall, getAxiosCall } from "../lib/axios";
import endpoints from "../config/endpoints";
import toast from "react-hot-toast";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [savedForLaterIds, setSavedForLaterIds] = useState([]);
  const [checkoutData, setCheckoutData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState("standard");
  const [deliveryData, setDeliveryData] = useState([]);
  const [getAllAddress, setGetAllAddress] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    nameresidency: "",
    region: "",
    province: "",
    city: "",
    zipcode: "",
    barangay: "",
    isdefault: false,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleSaveForLater = async (cartId) => {
    try {
      const res = await updateAxiosCall(
        endpoints.cart.saveForLater,
        cartId,
        {},
        true
      );
      // console.log(res);

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
      setCheckoutData(res || []);
    } catch (error) {
      setCheckoutData([]);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      id: address.ID,
      nameresidency: address.NameResidency,
      region: address.Region,
      province: address.Province,
      city: address.City,
      barangay: address.Barangay,
      zipcode: address.ZipCode,

      isdefault: address.IsDefault,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        nameresidency: formData.nameresidency,
        region: formData.region,
        province: formData.province,
        city: formData.city,
        barangay: formData.barangay,
        zipcode: formData.zipcode,

        isdefault: formData.isdefault,
      };

      if (formData.id) {
        payload.id = formData.id;
      }

      const res = await postAxiosCall(endpoints.address.add, payload, true);
      // console.log(res);

      toast.success(
        formData.id
          ? "Address updated successfully!"
          : "Address saved successfully!"
      );

      setFormData({
        id: null,
        nameresidency: "",
        region: "",
        province: "",
        city: "",
        barangay: "",
        zipcode: "",

        isdefault: false,
      });
      fetchAddressData();
    } catch (error) {
      console.error("API error:", error);
      toast.error("Failed to save address.");
    }
  };

  const fetchAddressData = async () => {
    try {
      const res = await getAxiosCall(endpoints.address.get, {}, true);
      setGetAllAddress(res?.data || []);
    } catch (error) {
      setGetAllAddress([]);
    }
  };

  const selectedAddress = async (id) => {
    console.log(id);
    try {
      const res = await postAxiosCall(
        endpoints.selectedAddress.add,
        { addressid: id },
        true
      );
      console.log("Address selected:", res);
      toast.success("Address selected successfully!");
    } catch (error) {
      console.error("Error selecting address:", error.message);
      toast.error("Something went wrong!");
    }
  };

  const addDeliveryData = async () => {
    try {
      const res = await postAxiosCall(
        endpoints.deliveryType.add,
        {
          checkoutsessionid: checkoutData?.checkout_session_id,
          addressid: selectedId,
          deliverytype: selected,
        },
        true
      );
      // console.log("Delivery type:", res);
      setDeliveryData(res || []);
      toast.success("Delivery type selected successfully!");
    } catch (error) {
      console.error("Error selecting address:", error.message);
      toast.error("Something went wrong!");
      setDeliveryData([]);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        toggleSaveForLater,
        savedForLaterIds,
        doCheckout,
        checkoutData,
        handleSubmit,
        handleChange,
        formData,
        fetchAddressData,
        getAllAddress,
        handleEdit,
        selectedAddress,
        selectedId,
        setSelectedId,
        selected,
        setSelected,
        addDeliveryData,
        deliveryData,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
