import React, { useEffect, useState } from "react";
import { useImageContext } from "../../contexts/ImageContext";
import { useLocation } from "react-router-dom";
import imageCompression from "browser-image-compression";
import { deleteAxiosCall } from "../../Axios/UniversalAxiosCalls";
import endpoints from "../../config/endpoints";

const ImageUploader = () => {
  const {
    base64Images,
    uploadImages,
    uploadedImageIds,
    setUploadedImageIds,
    setBase64Images,
  } = useImageContext();

  const location = useLocation();
  const medicine = location.state?.medicine;

  const [error, setError] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [existingImageIds, setExistingImageIds] = useState([]);

  useEffect(() => {
    if (medicine?.ItemImages?.length) {
      const urls = medicine.ItemImages.map((img) => img.FileName);
      const ids = medicine.ItemImages.map((img) => img.ID);
      setExistingImages(urls);
      setExistingImageIds(ids);
      setUploadedImageIds(ids);
    }
  }, [medicine]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const compressedBase64Images = [];

    for (const file of files) {
      try {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });

        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.readAsDataURL(compressedFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
        });

        compressedBase64Images.push(base64);
      } catch (err) {
        console.error("❌ Compression failed:", err);
      }
    }

    const totalCount =
      base64Images.length +
      compressedBase64Images.length +
      existingImages.length;

    if (totalCount > 5) {
      setError("❌ Max 5 images allowed (including existing).");
      return;
    }

    setError("");
    uploadImages("0", compressedBase64Images);
  };

  // ✅ Remove existing image with API call
  const handleRemoveExisting = async (index) => {
    const imageIdToDelete = existingImageIds[index];

    try {
      const res = await deleteAxiosCall(
        // "/v1/itemimage/delete-itemimage",
        endpoints.itemimage.delete(imageIdToDelete)
      );

      // Now update the UI
      const updatedUrls = [...existingImages];
      const updatedIds = [...existingImageIds];

      updatedUrls.splice(index, 1);
      updatedIds.splice(index, 1);

      setExistingImages(updatedUrls);
      setExistingImageIds(updatedIds);
      setUploadedImageIds([
        ...updatedIds,
        ...uploadedImageIds.filter((id) => !existingImageIds.includes(id)),
      ]);
    } catch (err) {
      console.error("❌ Image delete failed:", err);
    }
  };

  // ✅ Remove base64 image
  const handleRemoveBase64 = (index) => {
    const updatedImages = [...base64Images];
    updatedImages.splice(index, 1);
    setBase64Images(updatedImages);
  };

  return (
    <div className="space-y-4 mt-6">
      <label className="font-semibold block">📷 Upload Images</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="block w-full border p-2 rounded"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex flex-wrap gap-2 mt-2">
        {/* ✅ Existing images with remove */}
        {existingImages.map((img, i) => (
          <div key={`existing-${i}`} className="relative">
            <img
              src={img}
              alt={`existing-${i}`}
              className="w-20 h-20 object-cover rounded border"
            />
            <button
              onClick={() => handleRemoveExisting(i)}
              className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 text-xs"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}

        {/* ✅ New base64 images with remove */}
        {base64Images.map((img, i) => (
          <div key={`new-${i}`} className="relative">
            <img
              src={img}
              alt={`new-${i}`}
              className="w-20 h-20 object-cover rounded border"
            />
            <button
              onClick={() => handleRemoveBase64(i)}
              className="absolute top-0 right-0 text-white bg-red-500 rounded-full w-5 h-5 text-xs"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {(uploadedImageIds.length > 0 || existingImageIds.length > 0) && (
        <p className="text-green-600 text-sm">
          ✅ Total {existingImageIds.length + uploadedImageIds.length} image(s)
          selected
        </p>
      )}
    </div>
  );
};

export default ImageUploader;
