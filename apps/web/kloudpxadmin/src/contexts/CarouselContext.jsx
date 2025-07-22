import { createContext, useContext, useState } from "react";
import Swal from "sweetalert2";
import useBase64Converter from "../hooks/useBase64Converter";
import {
  getAxiosCall,
  postAxiosCall,
  updateAxiosCall,
  deleteAxiosCall,
} from "../Axios/UniversalAxiosCalls";

export const CarouselContext = createContext();

const CarouselProvider = ({ children }) => {
  const { convertToBase64 } = useBase64Converter();
  const [carouselImages, setCarouselImages] = useState([]);
  const [userData, setUserData] = useState([])
  const [allItemCount, setAllItemCount] = useState([]);

  const getAllCarouselImages = async () => {
    const res = await getAxiosCall("/v1/carousel/get-all-carousel-img");
    if (res?.data?.data) {
      setCarouselImages(res.data.data);
    }
  };

  const getAllUserData = async () => {
    const res = await getAxiosCall("/v1/admin/admin-dash-userinfo");
    if (res?.data) {
      setUserData(res.data)
    }
  }

  const getAllItemData = async () => {
    const res = await getAxiosCall("/v1/admin/admin-dash-medicinecount");
    if (res?.data) {
      setAllItemCount(res.data)
    }
  }



  const uploadCarouselImage = async (file) => {
    try {
      const base64 = await convertToBase64(file);
      const payload = { carouselimage: base64 };

      const res = await postAxiosCall("/v1/carousel/add-carousel-img", payload);
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
      const res = await updateAxiosCall(`/v1/carousel/update-status`, id, {});
      if (res?.message) {
        Swal.fire("Success", res.message, "success");
        await getAllCarouselImages();
      }
    } catch (error) {
      console.error("Status toggle failed", error);
    }
  };

  const deleteCarouselImage = async (id) => {
    try {
      const res = await deleteAxiosCall(`/v1/carousel/delete-carousel-img`, id);
      if (res?.message) {
        Swal.fire("Success", res.message, "success");
        await getAllCarouselImages();
      }
    } catch (error) {
      console.error("Failed to delete carousel image", error);
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
        getAllUserData,
        allItemCount,
        getAllItemData

      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};

export default CarouselProvider;
export const useCarouselContext = () => useContext(CarouselContext);
