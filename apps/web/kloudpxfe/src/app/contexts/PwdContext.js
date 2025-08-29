"use client";

import React, { createContext, useContext, useState } from "react";
import useImageCompressor from "../hooks/useImageCompressor";
import endpoints from "../config/endpoints";
import { postAxiosCall, getAxiosCall } from "../lib/axios";
import Swal from "sweetalert2";

const PwdContext = createContext();

export const PwdProvider = ({ children }) => {
  const { compressImage } = useImageCompressor();
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [allPwd, setAllPwd] = useState([]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const compressedBase64 = await compressImage(file, 800, 800, 0.6);
      const base64Data = compressedBase64.split(",")[1];
      const response = await postAxiosCall(
        endpoints.account.pwd,
        { file: base64Data },
        true
      );

      const uploadedUrl = response?.file_url || "";
      setFileUrl(uploadedUrl);
      getAllPwd();
      Swal.fire({
        title: "Success",
        text: "PWD certificate uploaded successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error("PWD upload failed:", error);
      Swal.fire({
        title: "Error",
        text:
          error?.response?.data?.message || "Failed to upload PWD certificate",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setUploading(false);
    }
  };

  const getAllPwd = async () => {
    try {
      const res = await getAxiosCall(endpoints.account.allpwd, {}, true);
      if (res?.status === 200) {
        setAllPwd(res?.data?.pwd || {});
      }
    } catch (error) {
      console.error("Error fetching All Pwd :", error);
      setAllPwd([]);
    }
  };

  return (
    <PwdContext.Provider
      value={{
        uploading,
        handleFileChange,
        fileUrl,
        getAllPwd,
        allPwd,
      }}
    >
      {children}
    </PwdContext.Provider>
  );
};

export const usePwdContext = () => useContext(PwdContext);
