"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getAxiosCall } from "@/app/lib/axios";
import endpoints from "@/app/config/endpoints";

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [carousel, setCarousel] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  // Get carousel images
  const getCarousel = async () => {
    try {
      const res = await getAxiosCall(endpoints.carousel.get);
      if (res?.status === 200) {
        setCarousel(res.data?.data || []);
      } else {
        setCarousel([]);
      }
    } catch (error) {
      setCarousel([]);
    }
  };

  // Get gallery images
  const getGalleryImages = async () => {
    try {
      const res = await getAxiosCall(endpoints.gallery.get);
      if (res?.status === 200) {
        setGalleryImages(res.data || []);
      } else {
        setGalleryImages([]);
      }
    } catch (error) {
      setGalleryImages([]);
    }
  };

  return (
    <ImageContext.Provider
      value={{
        carousel,
        getCarousel,
        galleryImages,
        getGalleryImages,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => useContext(ImageContext);
