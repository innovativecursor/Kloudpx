import { createContext, useContext, useState } from "react";
import { postAxiosCall } from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import endpoints from "../config/endpoints";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [base64Images, setBase64Images] = useState([]);
  const [uploadedImageIds, setUploadedImageIds] = useState([]);

  const uploadImages = async (itemId = "0", imagesToUpload = []) => {
    try {
      const cleanBase64Images = imagesToUpload.map((img) =>
        img.includes(",") ? img.split(",")[1] : img
      );

      const payload = {
        item_id: itemId,
        images: cleanBase64Images,
      };
      const res = await postAxiosCall(endpoints.itemimage.add, payload);
      const imageIds = res?.image_ids || [];

      setUploadedImageIds(imageIds);
      setBase64Images(imagesToUpload);

      Swal.fire("Uploaded", "Images uploaded successfully!", "success");
    } catch (error) {
      console.error(
        "❌ Upload failed:",
        error?.response?.data || error.message
      );
      Swal.fire("Error", "Image upload failed", "error");
    }
  };

  return (
    <ImageContext.Provider
      value={{
        base64Images,
        uploadImages,
        setBase64Images,
        uploadedImageIds,
        setUploadedImageIds,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);
