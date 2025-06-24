export default function ImageUploader({
  handleImageChange,
  handleUpload,
  images,
  previewUrls,
  message,
  id,
  disabled,
}) {
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
      <button
        type="button"
        onClick={(e) => handleUpload(e, id)}
        className={`px-4 py-2 rounded text-white ${
          images.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
        }`}
        disabled={images.length === 0}
      >
        Upload Images
      </button>

      {previewUrls.length > 0 && (
        <div className="mt-4 flex gap-4 flex-wrap">
          {previewUrls.map((url, idx) => (
            <img
              key={idx}
              src={url}
              alt={`preview-${idx}`}
              className="w-24 h-24 object-cover rounded border"
            />
          ))}
        </div>
      )}

      {message && (
        <p className="mt-3 text-sm font-medium text-red-600">{message}</p>
      )}
    </div>
  );
}
