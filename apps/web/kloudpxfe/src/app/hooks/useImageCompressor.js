"use client";

import { useCallback } from "react";

const useImageCompressor = () => {
  const compressImage = useCallback(
    (file, maxWidth = 300, maxHeight = 300, quality = 0.4) =>
      new Promise((resolve, reject) => {
        if (!file) return reject("No file provided");

        const reader = new FileReader();
        const img = new Image();

        reader.onload = (event) => {
          img.src = event.target.result;
        };

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          // Maintain aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const base64 = canvas.toDataURL("image/jpeg", quality);
          resolve(base64);
        };

        img.onerror = (err) => reject("Image load error");
        reader.onerror = (err) => reject("File read error");

        reader.readAsDataURL(file);
      }),
    []
  );

  return { compressImage };
};

export default useImageCompressor;
