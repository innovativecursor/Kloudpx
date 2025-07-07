"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [carousel, setCarousel] = useState({ data: [], loading: false });
  const [galleryImages, setGalleryImages] = useState({
    data: [],
    loading: false,
  });
  const [branded, setbranded] = useState({ data: [], loading: false });

  // for carousel ...
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
      setCarousel((prev) => ({ ...prev, loading: false }));
    }
  };

  // for gallery images ...
  const getGalleryImages = async () => {
    setGalleryImages({ data: [], loading: true });
    try {
      const { data, status } = await axios.get(
        `http://localhost:10003/v1/user/get-gallery-img-user`
      );
      if (status === 200) {
        setGalleryImages({ data: data || [], loading: false });
      } else {
        setGalleryImages({ data: [], loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setGalleryImages((prev) => ({ ...prev, loading: false }));
    }
  };

  // branded
  const getBranded = async () => {
    setbranded({ data: [], loading: true });
    try {
      const { data, status } = await axios.get(
        `http://localhost:10003/v1/user/get-branded-medicine`
      );
      if (status === 200) {
        setbranded({ data: data || [], loading: false });
      } else {
        setbranded({ data: [], loading: false });
      }
    } catch (error) {
      console.log(error.message);
      setbranded((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    getCarousel();
    getGalleryImages();
    getBranded();
  }, []);

  console.log(branded);

  return (
    <ImageContext.Provider
      value={{
        carousel,
        getCarousel,
        getGalleryImages,
        galleryImages,
        branded,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);
