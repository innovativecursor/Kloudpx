"use client";

import React, { createContext, useContext, useState } from "react";
import useImageCompressor from "../hooks/useImageCompressor";
import endpoints from "../config/endpoints";
import { postAxiosCall, getAxiosCall } from "../lib/axios";
import Swal from "sweetalert2";

const SeniorCitizenContext = createContext();

export const SeniorCitizenProvider = ({ children }) => {
  const { compressImage } = useImageCompressor();
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [allSenior, setAllSenior] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const compressedBase64 = await compressImage(file, 800, 800, 0.6);
      const base64Data = compressedBase64.split(",")[1];
      const response = await postAxiosCall(
        endpoints.seniorcitizen.add,
        { file: base64Data },
        true
      );

      const uploadedUrl = response?.file_url || "";
      setFileUrl(uploadedUrl);
      getAllSenior();

      Swal.fire({
        title: "Success",
        text: "Senior Citizen certificate uploaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("Senior Citizen upload failed:", error);
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to upload Senior Citizen certificate",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUploading(false);
    }
  };

  const getAllSenior = async () => {
    try {
      const res = await getAxiosCall(endpoints.seniorcitizen.get, {}, true);

      if (res?.status === 200) {
        setAllSenior(res?.data || {});
      }
    } catch (error) {
      console.error("Error fetching Senior Citizen data:", error);
      setAllSenior([]);
    }
  };

  return (
    <SeniorCitizenContext.Provider
      value={{
        uploading,
        handleFileChange,
        fileUrl,
        getAllSenior,
        allSenior,
      }}
    >
      {children}
    </SeniorCitizenContext.Provider>
  );
};

export const useSeniorCitizenContext = () => useContext(SeniorCitizenContext);
