"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [carousel, setCarousel] = useState({ data: [], loading: true });

  const getCarousel = async () => {
    setCarousel({ data: [], loading: true });
    try {
      const { data, status } = await axios.get(
        `http://localhost:10003/v1/user/get-carousel-img-user`
      );
      if (status === 200) {
        setCarousel({ data: data.data, loading: false });
      } else {
        setCarousel({ data: [], loading: false });
      }
    } catch (error) {
      console.error(error.message);
      setCarousel({ data: [], loading: false });
    }
  };

  useEffect(() => {
    getCarousel();
  }, []);

  return (
    <ImageContext.Provider value={{ carousel, getCarousel }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);
