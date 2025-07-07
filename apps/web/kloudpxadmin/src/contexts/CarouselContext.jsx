import { createContext, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import useBase64Converter from "../hooks/useBase64Converter";
import { useAuthContext } from "./AuthContext";  // import your AuthContext

export const CarouselContext = createContext();

const CarouselProvider = ({ children }) => {
  const { convertToBase64 } = useBase64Converter();
  const { token } = useAuthContext();

  const uploadCarouselImage = async (file) => {
    try {
      if (!token) {
        Swal.fire("Error", "Authentication token missing, please login.", "error");
        return;
      }

      const base64 = await convertToBase64(file);
      const payload = { carouselimage: base64 };

      const response = await axios.post(
        `http://localhost:10001/v1/carousel/add-carousel-img`,
        payload,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire("Success", response.data.message || "Image uploaded successfully", "success");
      } else {
        Swal.fire("Error", "Image upload failed", "error");
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || error.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <CarouselContext.Provider value={{ uploadCarouselImage }}>
      {children}
    </CarouselContext.Provider>
  );
};

export default CarouselProvider;
export const useCarouselContext = () => useContext(CarouselContext);
