"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  updateAxiosCall,
  postAxiosCall,
  getAxiosCall,
  deleteAxiosCall,
} from "../lib/axios";
import endpoints from "../config/endpoints";
import toast from "react-hot-toast";

const CheckoutContext = createContext();

export const CheckoutProvider = ({ children }) => {
  const [savedForLaterIds, setSavedForLaterIds] = useState([]);
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedId, setSelectedId] = useState(() => {
    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("selectedaddressId");
      return id ? Number(id) : null;
    }
    return null;
  });

  const [selected, setSelected] = useState("standard");
  const [deliveryData, setDeliveryData] = useState(null);
  const [getAllAddress, setGetAllAddress] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("GCOD");
  const [addressType, setAddressType] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    nameresidency: "",
    region: "",
    province: "",
    city: "",
    zipcode: "",
    barangay: "",
    phonenumber: "",
    isdefault: false,
    address_type_id: null,
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
      return false;
    }
  };

  const doCheckout = async () => {
    try {
      const res = await postAxiosCall(endpoints.checkout.get, {}, true);
      setCheckoutData(res || null);
    } catch (error) {
      setCheckoutData(null);
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
      phonenumber: address.PhoneNumber || "",
      isdefault: address.IsDefault,
      address_type_id: address.addresstype,
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     const payload = {
  //       nameresidency: formData.nameresidency,
  //       region: formData.region,
  //       province: formData.province,
  //       city: formData.city,
  //       barangay: formData.barangay,
  //       zipcode: formData.zipcode,
  //       phonenumber: formData.phonenumber,
  //       isdefault: formData.isdefault,
  //       address_type_id: formData.address_type_id,
  //     };

  //     if (formData.id) {
  //       payload.id = formData.id;
  //     }

  //     const res = await postAxiosCall(endpoints.address.add, payload, true);

  //     toast.success(
  //       formData.id
  //         ? "Address updated successfully!"
  //         : "Address saved successfully!"
  //     );

  //     setFormData({
  //       id: null,
  //       nameresidency: "",
  //       region: "",
  //       province: "",
  //       city: "",
  //       barangay: "",
  //       zipcode: "",
  //       addresstype: "",
  //       isdefault: false,
  //     });
  //     fetchAddressData();
  //   } catch (error) {
  //     // console.error("API error:", error);
  //     if (error.response?.data?.error) {
  //       toast.error(error.response.data.error);
  //     } else {
  //       toast.error("Failed to save address.");
  //     }
  //   }
  // };



  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Front-end validation
    const requiredFields = [
      "nameresidency",
      "region",
      "province",
      "city",
      "barangay",
      "zipcode",
      "phonenumber",
      "address_type_id",
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].toString().trim() === "") {
        toast.error(`Please fill the ${field} field`);
        return;
      }
    }

    try {
      const payload = {
        nameresidency: formData.nameresidency,
        region: formData.region,
        province: formData.province,
        city: formData.city,
        barangay: formData.barangay,
        zipcode: formData.zipcode,
        phonenumber: formData.phonenumber,
        isdefault: formData.isdefault,
        address_type_id: formData.address_type_id,
      };

      if (formData.id) {
        payload.id = formData.id;
      }

      const res = await postAxiosCall(endpoints.address.add, payload, true);

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
        addresstype: "",
        isdefault: false,
        address_type_id: null,
      });
      fetchAddressData();
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Failed to save address.");
      }
    }
  };






  const fetchAddressData = async () => {
    try {
      const res = await getAxiosCall(endpoints.address.get, {}, true);
      console.log(res, "jjjj");
      setGetAllAddress(res?.data || []);
    } catch (error) {
      setGetAllAddress([]);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!id) return;
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this address?"
      );
      if (!confirmDelete) return;

      await deleteAxiosCall(endpoints.removeaddress.remove(id), true);
      toast.success("Address deleted successfully!");
      fetchAddressData();
      if (selectedId === id) setSelectedId(null);
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address.");
    }
  };

  const fetchAddresstype = async () => {
    try {
      const res = await getAxiosCall(endpoints.addresstype.get, {});
      setAddressType(res?.data?.address_types || []);
    } catch (error) {
      setAddressType([]);
    }
  };

  const selectedAddress = async (id) => {
    try {
      const res = await postAxiosCall(
        endpoints.selectedAddress.add,
        { addressid: id },
        true
      );
      console.log(res, "selected");

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

      setDeliveryData(res || null);
    } catch (error) {
      setDeliveryData(null);
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
        paymentMethod,
        setPaymentMethod,
        setDeliveryData,
        setCheckoutData,
        fetchAddresstype,
        addressType,
        handleDeleteAddress,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => useContext(CheckoutContext);
