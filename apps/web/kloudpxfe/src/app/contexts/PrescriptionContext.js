"use client";

import { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/AuthContext";

const PrescriptionContext = createContext();

export const PrescriptionProvider = ({ children }) => {
  const { token } = useAuth();

  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(uploadedImage);

  const uploadPrescription = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      try {
        setLoading(true);
        const base64String = reader.result;
        const base64Data = base64String.split(",")[1];

        console.log("Sending to API:", { prescriptionimage: base64Data });

        const response = await axios.post(
          "http://localhost:10003/v1/user/upload-prescription",
          { prescriptionimage: base64Data },
          {
            headers: { Authorization: token },
          }
        );

        // console.log("Upload response from backend:", response.data);

        const { url } = response.data;
        setUploadedImage(url);

        toast.success("Prescription uploaded successfully");
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
        loading,
        uploadPrescription,
        setUploadedImage,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptionContext = () => useContext(PrescriptionContext);
