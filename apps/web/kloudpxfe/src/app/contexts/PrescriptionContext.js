

import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/AuthContext";
import { postAxiosCall } from "@/app/lib/axios";
import endpoints from "@/app/config/endpoints";
import useImageCompressor from "@/app/hooks/useImageCompressor";
import { useCartContext } from "./CartContext";

const PrescriptionContext = createContext();

export const PrescriptionProvider = ({ children }) => {
  const { token, login } = useAuth();
  const { compressImage } = useImageCompressor();

  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedPrescriptionId, setUploadedPrescriptionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pendingCartData, setPendingCartData] = useState(null);
  const { getAllCartData } = useCartContext();

  // console.log(pendingCartData);

  const uploadPrescription = async (file, medicineid, quantity) => {
    if (!file) return;

    if (!token) {
      toast.error("Please login first!");
      login?.();
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
      const prescriptionId = res?.prescription_id;
      // console.log(prescriptionId);

      setUploadedPrescriptionId(prescriptionId);

      if (res?.url) {
        const img = new Image();
        img.src = res.url;

        img.onload = async () => {
          setUploadedImage(res.url);
          // toast.success("Prescription uploaded successfully");
          setIsOpen(false);
          setLoading(false);

          // console.log("🧾 Debug Prescription Payload:");
          // console.log("prescriptionId:", prescriptionId);
          // console.log("medicineId:", medicineid);
          // console.log("quantity:", quantity);

          if (!medicineid || !prescriptionId || !quantity) {
            console.error("❌ Missing data in prescription cart call", {
              medicineid,
              prescriptionId,
              quantity,
            });
            toast.error("Something went wrong, missing data.");
            return;
          }

          await postAxiosCall(
            // "http://localhost:10003/v1/user/add-to-cart-medicine",
            endpoints.prescriptioncart.add,
            {
              medicineid,
              prescriptionid: prescriptionId,
              quantity,
            },
            true
          );
          toast.success("Item added to cart with prescription!");
          getAllCartData();
        };

        img.onerror = () => {
          toast.error("Image failed to load.");
          setLoading(false);
        };
      } else {
        setLoading(false);
      }
    } catch (err) {
      toast.error("Upload failed. Try again.");
      setLoading(false);
    }
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
        uploadedPrescriptionId,
        pendingCartData,
        setPendingCartData,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptionContext = () => useContext(PrescriptionContext);
