import { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";
import useBase64Converter from "../hooks/useBase64Converter";
import {
  getAxiosCall,
  postAxiosCall,
  updateAxiosCall,
  deleteAxiosCall,
} from "../Axios/UniversalAxiosCalls";
import endpoints from "../config/endpoints";

export const CarouselContext = createContext();

const CarouselProvider = ({ children }) => {
  const { convertToBase64 } = useBase64Converter();
  const [carouselImages, setCarouselImages] = useState([]);
  const [userData, setUserData] = useState([]);
  const [allItemCount, setAllItemCount] = useState([]);

  const getAllCarouselImages = async () => {
    const res = await getAxiosCall(endpoints.carousel.get);
    if (res?.data?.data) {
      setCarouselImages(res.data.data);
    }
  };

  const getAllUserData = async () => {
    const res = await getAxiosCall(endpoints.userCount.get);
    if (res?.data) {
      setUserData(res.data);
    }
  };

  const getAllItemData = async () => {
    const res = await getAxiosCall(endpoints.medicineCount.get);
    if (res?.data) {
      setAllItemCount(res.data);
    }
  };

  const uploadCarouselImage = async (file) => {
    try {
      const base64 = await convertToBase64(file);
      const payload = { carouselimage: base64 };
      const res = await postAxiosCall(endpoints.carousel.add, payload);
      if (res?.message) {
        Swal.fire("Success", res.message, "success");
        getAllCarouselImages();
      } else {
        Swal.fire("Error", "Image upload failed", "error");
      }
    } catch (error) {
      Swal.fire("Error", error?.message || "Something went wrong", "error");
    }
  };

  const toggleCarouselStatus = async (id) => {
    try {
      const res = await updateAxiosCall(
        endpoints.carousel.updateStatus(id),
        {}
      );
      if (res?.message) {
        Swal.fire("Success", res.message, "success");
        await getAllCarouselImages();
      }
    } catch (error) {
      console.log("Status toggle failed", error);
    }
  };

  const deleteCarouselImage = async (id) => {
    try {
      const res = await deleteAxiosCall(endpoints.carousel.delete(id));
      if (res?.message) {
        Swal.fire("Success", res.message, "success");
        await getAllCarouselImages();
      }
    } catch (error) {
      console.log("Failed to delete carousel image", error);
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        carouselImages,
        getAllCarouselImages,
        uploadCarouselImage,
        toggleCarouselStatus,
        deleteCarouselImage,
        getAllUserData,
        userData,
        allItemCount,
        getAllItemData,
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};

export default CarouselProvider;
export const useCarouselContext = () => useContext(CarouselContext);
