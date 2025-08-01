import { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";
import useBase64Converter from "../hooks/useBase64Converter";
import {
  postAxiosCall,
  getAxiosCall,
  updateAxiosCall,
  deleteAxiosCall,
} from "../Axios/UniversalAxiosCalls";
import endpoints from "../config/endpoints";

export const GalleryContext = createContext();

const GalleryProvider = ({ children }) => {
  const { convertToBase64 } = useBase64Converter();
  const [Images, setImages] = useState([]);

  const getAllImages = async () => {
    const res = await getAxiosCall(endpoints.gallery.get);
    if (res?.data?.data) {
      setImages(res.data.data);
    }
  };

  const uploadGalleryImage = async (file, buttonText, link) => {
    try {
      const base64 = await convertToBase64(file);
      const payload = {
        buttontext: buttonText,
        galleryimg: base64,
        link: link || null,
      };

      const res = await postAxiosCall(endpoints.gallery.add, payload);

      if (res?.message) {
        Swal.fire("Success", res.message, "success");
        getAllImages();
      } else {
        Swal.fire("Error", "Image upload failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", error?.message || "Something went wrong", "error");
    }
  };

  const toggleImagesStatus = async (id) => {
    try {
      const res = await updateAxiosCall(endpoints.gallery.updateStatus(id), {});
      if (res?.message) {
        Swal.fire("Success", res.message, "success");
        await getAllImages();
      }
    } catch (error) {
      console.error("Status toggle failed", error);
    }
  };

  const deleteImage = async (id) => {
    console.log(id, "is here");

    try {
      const res = await deleteAxiosCall(endpoints.gallery.delete(id));
      if (res?.message) {
        Swal.fire("Success", res.message, "success");
        await getAllImages();
      }
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  return (
    <GalleryContext.Provider
      value={{
        uploadGalleryImage,
        getAllImages,
        Images,
        toggleImagesStatus,
        deleteImage,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryProvider;
export const useGalleryContext = () => useContext(GalleryContext);
