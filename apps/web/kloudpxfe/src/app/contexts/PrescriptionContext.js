import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/app/contexts/AuthContext";
import { postAxiosCall } from "@/app/lib/axios";
import endpoints from "@/app/config/endpoints";
import useImageCompressor from "@/app/hooks/useImageCompressor";

const PrescriptionContext = createContext();

export const PrescriptionProvider = ({ children }) => {
  const { token, login } = useAuth();
  const { compressImage } = useImageCompressor();

  const [isOpen, setIsOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadPrescription = async (file) => {
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

      if (res?.url) {
        const img = new Image();
        img.src = res.url;

        img.onload = () => {
          setUploadedImage(res.url);
          toast.success("Prescription uploaded successfully");
          setIsOpen(false);
          setLoading(false);
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
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
};

export const usePrescriptionContext = () => useContext(PrescriptionContext);
