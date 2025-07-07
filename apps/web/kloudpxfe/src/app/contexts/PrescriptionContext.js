"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/AuthContext";
import useModal from "@/app/hooks/useModal";
import { useLoading } from "@/app/contexts/LoadingContext";

const PrescriptionContext = createContext();

export const PrescriptionProvider = ({ children }) => {
  const { token } = useAuth();
  const { setIsOpen } = useModal();
  const { setLoading } = useLoading();

  const [uploadedImage, setUploadedImage] = useState(null);

  const uploadPrescription = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        setLoading(true); // ✅ Start loading
        const base64String = reader.result;
        const base64Data = base64String.split(",")[1];

        const response = await axios.post(
          "http://localhost:10003/v1/user/upload-prescription",
          { prescriptionimage: base64Data },
          {
            headers: { Authorization: token },
          }
        );

        const { url } = response.data;
        setUploadedImage(url);
        toast.success("Prescription uploaded successfully");
        setIsOpen(false);
      } catch (error) {
        console.error(
          "Upload failed:",
          error.response || error.message || error
        );
        toast.error("Upload failed");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <PrescriptionContext.Provider
      value={{
        uploadedImage,
        uploadPrescription,
        setUploadedImage,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptionContext = () => useContext(PrescriptionContext);
