"use client";

import React, { useState } from "react";
import { FaPaperclip } from "react-icons/fa";
import Swal from "sweetalert2";
import { postAxiosCall } from "@/app/lib/axios";
import useImageCompressor from "@/app/hooks/useImageCompressor";
import endpoints from "@/app/config/endpoints";

const Pwd = () => {
  const { compressImage } = useImageCompressor();
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

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

  return (
    <div>
      <div className="flex md:flex-row flex-col justify-between md:items-end items-center bg-blue-50/20 md:p-8 rounded-xl md:max-w-3xl w-full  space-y-6">
        <h2 className="md:text-2xl text-xl font-semibold mb-4">
          PWD Certificate
        </h2>

        <label
          htmlFor="upload"
          className={`bg-[#0070BA] md:w-[50%] hover:bg-[#005c96] cursor-pointer text-white flex items-center justify-center gap-2 
                       md:text-sm text-[8px] w-full lg:py-3 md:py-2 py-3 px-5 rounded-full mb-4 ${
                         uploading ? "opacity-50 cursor-not-allowed" : ""
                       }`}
        >
          <FaPaperclip className="text-base" />
          <span className="sm:text-sm text-xs">
            {uploading ? "Uploading..." : "Upload Pwd Certificate"}
          </span>
          <input
            type="file"
            id="upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {fileUrl && (
        <div className="mt-4 md:max-w-3xl w-full flex flex-col items-start gap-2">
          <span className="text-sm text-gray-700 cursor-pointer">
            Your PWD Certificate
          </span>
          <img
            src={fileUrl}
            alt="PWD Certificate"
            className="w-full h-full p-4 rounded-xl border-2 border-[#0070ba] cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};

export default Pwd;
