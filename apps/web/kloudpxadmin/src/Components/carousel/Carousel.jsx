import React, { useEffect, useState } from "react";
import { useCarouselContext } from "../../contexts/CarouselContext";

const Carousel = () => {
  const {
    uploadCarouselImage,
    carouselImages,
    getAllCarouselImages,
    toggleCarouselStatus,
    deleteCarouselImage,
  } = useCarouselContext();
  const [file, setFile] = useState(null);

  useEffect(() => {
    getAllCarouselImages();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Select an image first");
    await uploadCarouselImage(file);
    setFile(null);
    getAllCarouselImages();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Heading */}
      <h1 className="text-3xl font-extrabold text-center mb-8 text-indigo-700">
        🎠 Carousel Image Manager
      </h1>

      {/* Upload Section */}
      <div className="mb-10 flex flex-col sm:flex-row items-center gap-6">
        {/* File Input Container */}
        <label
          htmlFor="file-upload"
          className="flex items-center justify-center w-full sm:w-96 p-4 border-2 border-dashed border-indigo-400 rounded-lg cursor-pointer hover:border-indigo-600 transition-colors"
        >
          {file ? (
            <div className="flex items-center gap-3">
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-14 h-14 object-cover rounded-md border border-gray-300"
              />
              <div className="text-indigo-700 font-semibold truncate max-w-xs">
                {file.name}
              </div>
            </div>
          ) : (
            <span className="text-indigo-500 font-medium">
              Click to select an image or drag it here
            </span>
          )}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file}
          className={`px-6 py-3 rounded-md text-white font-semibold shadow-md transition 
            ${
              file
                ? "bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300"
                : "bg-indigo-300 cursor-not-allowed"
            }`}
        >
          Upload Image
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider"
              >
                #
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider"
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-semibold text-indigo-700 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-center text-sm font-semibold text-indigo-700 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {carouselImages.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400 italic">
                  No carousel images found.
                </td>
              </tr>
            ) : (
              carouselImages.map((item, index) => (
                <tr
                  key={item.ID}
                  className="hover:bg-indigo-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img
                      src={item.ImageURL}
                      alt={`carousel-${index + 1}`}
                      className="w-28 h-16 object-cover rounded-md border border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        item.IsActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.IsActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-3">
                    <button
                      onClick={() => toggleCarouselStatus(item.ID)}
                      className={`inline-block px-4 py-1 rounded-md text-sm font-semibold text-white transition ${
                        item.IsActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                        item.IsActive ? "focus:ring-red-500" : "focus:ring-green-500"
                      }`}
                    >
                      {item.IsActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => deleteCarouselImage(item.ID)}
                      disabled={item.IsActive}
                      title="Delete image"
                      className={`inline-block text-red-600 hover:text-red-800 transition ${
                        item.IsActive ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <i className="ri-delete-bin-line text-xl"></i>
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

export default Carousel;
