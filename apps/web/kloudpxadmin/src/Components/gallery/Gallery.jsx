import React, { useState, useRef, useEffect } from "react";
import { useGalleryContext } from "../../contexts/GalleryContext";

const Gallery = () => {
  const {
    uploadGalleryImage,
    getAllImages,
    Images,
    toggleImagesStatus,
    deleteImage,
  } = useGalleryContext();

  const [file, setFile] = useState(null);
  const [buttonText, setButtonText] = useState("");
  const [link, setLink] = useState("");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image");
    if (!buttonText.trim()) return alert("Please enter button text");

    await uploadGalleryImage(file, buttonText, link);
    setFile(null);
    setButtonText("");
    setLink("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    getAllImages();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:mt-20 mt-12">
      <h1 className="text-3xl font-bold text-indigo-700 text-center mb-10">
        🖼️ Gallery Image Manager
      </h1>

      {/* Upload Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-10 border border-gray-100">
        <div className="grid md:grid-cols-3 gap-6">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 transition"
          >
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <div className="text-center text-indigo-500">
                Click or drag image here to upload
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </label>

          <input
            type="text"
            placeholder="Enter Button Text"
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="p-3 border border-gray-600 rounded-md w-full focus:ring focus:ring-indigo-200"
          />

          <input
            type="text"
            placeholder="Enter Link (optional)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="p-3 border border-gray-600 rounded-md w-full focus:ring focus:ring-indigo-200"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={!file || !buttonText}
          className={`w-full py-3 rounded-md mt-6 font-semibold text-white transition ${
            file && buttonText
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-indigo-300 cursor-not-allowed"
          }`}
        >
          Upload Image
        </button>
      </div>

      {/* Gallery Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-indigo-700 uppercase">
                #
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-indigo-700 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-indigo-700 uppercase">
                Button Text
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-indigo-700 uppercase">
                Link
              </th>

              <th className="px-6 py-3 text-left text-sm font-medium text-indigo-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-indigo-700 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {Images?.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-400">
                  No images uploaded yet.
                </td>
              </tr>
            ) : (
              Images.map((img, index) => (
                <tr key={img.ID} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4">
                    <img
                      src={img.ImageURL}
                      alt={`gallery-${index + 1}`}
                      className="w-28 h-16 rounded object-cover border"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                    {img.ButtonText}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600 underline">
                    <a
                      href={img.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {img.Link ? "Open" : "N/A"}
                    </a>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        img.IsActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {img.IsActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => toggleImagesStatus(img.ID)}
                      className={`px-4 py-1 text-sm font-semibold rounded-md text-white transition ${
                        img.IsActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {img.IsActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => deleteImage(img.ID)}
                      disabled={img.IsActive}
                      className={`text-red-600 hover:text-red-800 text-xl ${
                        img.IsActive ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Gallery;
