import { createContext, useContext, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { store } from "@store";
import { useAuthContext } from "./AuthContext";
import imageCompression from "browser-image-compression";

export const ImageContext = createContext();

const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [uploadedImageIds, setUploadedImageIds] = useState([]);
  const { token, checkToken } = useAuthContext();

  const handleImageChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 5) {
      setMessage("❌ Max 5 images allowed.");
      return;
    }

    const compressedFiles = [];
    const previews = [];

    for (const file of selectedFiles) {
      try {
        const options = {
          maxSizeMB: 0.05,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);
        compressedFiles.push(compressedFile);
        const previewUrl = URL.createObjectURL(compressedFile);
        previews.push(previewUrl);
      } catch (error) {
        console.error("Compression Error:", error);
        setMessage("❌ Failed to compress some image.");
      }
    }

    setImages([...images, ...compressedFiles]);
    setPreviewUrls([...previewUrls, ...previews]);
    setMessage("");
  };

  const handleUpload = async (e, itemId) => {
    e.preventDefault();

    if (!checkToken()) {
      setMessage("Authentication token missing. Please login again.");
      return;
    }

    try {
      store.dispatch({ type: "LOADING", payload: true });
      const convertToBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result.split(",")[1]);
          };
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });

      const base64Images = await Promise.all(images.map(convertToBase64));

      const instance = axios.create({
        baseURL: process.env.REACT_APP_UAT_URL,
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const payload = {
        item_id: itemId || "0",
        images: base64Images,
      };

      const response = await instance.post(
        "/v1/itemimage/add-itemimage",
        payload
      );

      const uploadedIds = response.data.image_ids || [];
      setUploadedImageIds((prev) => [...prev, ...uploadedIds]);
      setMessage("✅ Images uploaded successfully!");
      setImages([]);
      setPreviewUrls([]);
    } catch (error) {
      setMessage("❌ Image upload failed.");
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || error.message,
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
    } finally {
      store.dispatch({ type: "LOADING", payload: false });
    }
  };

  return (
    <ImageContext.Provider
      value={{
        images,
        previewUrls,
        message,
        uploadedImageIds,
        handleImageChange,
        handleUpload,
        setUploadedImageIds,
        setPreviewUrls,
        setMessage,
        setImages,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export default ImageProvider;
export const useImageContext = () => useContext(ImageContext);
