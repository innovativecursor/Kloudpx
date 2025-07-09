export default function ImageUploader({
  handleImageChange,
  handleUpload,
  images,
  previewUrls,
  message,
  id,
  disabled,
  setImages,
  setUploadedImageIds,
  setPreviewUrls,
}) {
  const handleRemoveImage = (index) => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      return newImages;
    });
    setPreviewUrls((prevPreviewUrls) => {
      const newPreviewUrls = [...prevPreviewUrls];
      newPreviewUrls.splice(index, 1);
      return newPreviewUrls;
    });
    setUploadedImageIds((prevUploadedIds) => {
      if (prevUploadedIds && prevUploadedIds.length > index) {
        const newUploadedIds = [...prevUploadedIds];
        newUploadedIds.splice(index, 1);
        return newUploadedIds;
      }
      return prevUploadedIds;
    });
  };

  return (
    <div className="p-4 border rounded-md mt-4 flex flex-col md:col-span-2">
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
        disabled={disabled}
        className="mb-4"
      />

      {previewUrls.length > 0 && (
        <div className="mt-4 flex gap-4 flex-wrap">
          {previewUrls.map((url, idx) => (
            <div key={idx} className="relative w-24 h-24">
              <img
                src={url}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={(e) => handleUpload(e, id)}
        className={`px-4 py-2 rounded text-white mt-4 ${
          images.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
        }`}
        disabled={images.length === 0}
      >
        Upload Images
      </button>
      {message && (
        <p className="mt-3 text-sm font-medium text-red-600">{message}</p>
      )}
    </div>
  );
}
