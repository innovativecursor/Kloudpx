"use client";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/AuthContext";
import { getAxiosCall, postAxiosCall, updateAxiosCall } from "@/app/lib/axios";
import endpoints from "@/app/config/endpoints";
import useImageCompressor from "@/app/hooks/useImageCompressor";
import { useCartContext } from "./CartContext";
import { useLoginAuth } from "./LoginAuth";

const PrescriptionContext = createContext();

export const PrescriptionProvider = ({ children }) => {
  const { token } = useAuth();
  const { compressImage } = useImageCompressor();
  const { openSignup } = useLoginAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pendingCartData, setPendingCartData] = useState(null);
  const [allPrescription, setAllPrescription] = useState([]);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const { getAllCartData } = useCartContext();

  const uploadPrescription = async (file) => {
    if (!file) return;

    if (!token) {
      // toast.error("Please login first!");
      openSignup();
      return;
    }

    try {
      setLoading(true);
      const compressedBase64 = await compressImage(file);
      const base64Data = compressedBase64.split(",")[1];

      const payload = {
        prescriptionimage: base64Data,
      };

      const res = await postAxiosCall(
        endpoints.prescription.upload,
        payload,
        true
      );

      // console.log(res);

      setUploadedImage(res.data?.url || compressedBase64);

      getAllPrescription();
    } catch (err) {
      toast.error("Upload failed. Try again.");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getAllPrescription = async () => {
    if (!token) return;
    try {
      const res = await getAxiosCall(endpoints.prescription.get, {}, true);
      setAllPrescription(res?.data?.prescriptions || []);
    } catch (error) {
      setAllPrescription([]);
    }
  };

  const handleSelectedPrescription = async (id) => {
    try {
      const res = await updateAxiosCall(
        endpoints.selectedprescription.put,
        id,
        {},
        true
      );
    } catch (error) {
      console.error("Error selecting prescription:", error);
    }
  };

  const addMedicineToCartWithPrescription = async (
    medicineid,
    prescriptionid,
    quantity
  ) => {
    if (!medicineid || !prescriptionid || !quantity) {
      toast.error("Missing data for cart.");
      console.error("Missing params:", {
        medicineid,
        prescriptionid,
        quantity,
      });
      throw new Error("Missing data");
    }
    try {
      await postAxiosCall(
        endpoints.prescriptioncart.add,
        {
          medicineid,
          prescriptionid,
          quantity,
        },
        true
      );
      toast.success("Item added to cart with prescription!");
      setSelectedPrescriptionId(null);
      getAllCartData();
    } catch (error) {
      console.error(
        "Cart error response:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Failed to add item to cart."
      );
      throw error;
    }
  };

  const clearPrescription = () => {
    setAllPrescription([]);
  };

  return (
    <PrescriptionContext.Provider
      value={{
        isOpen,
        setIsOpen,
        uploadedImage,
        uploadPrescription,
        setUploadedImage,
        loading,

        pendingCartData,
        setPendingCartData,
        getAllPrescription,
        allPrescription,
        handleSelectedPrescription,
        selectedPrescriptionId,
        setSelectedPrescriptionId,
        addMedicineToCartWithPrescription,
        clearPrescription
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptionContext = () => useContext(PrescriptionContext);
