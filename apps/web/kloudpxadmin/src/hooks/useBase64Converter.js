import imageCompression from "browser-image-compression";

const useBase64Converter = () => {
  const convertToBase64 = async (file, maxSizeMB = 0.5) => {
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are allowed");
      }

      const options = {
        maxSizeMB,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return { convertToBase64 };
};

export default useBase64Converter;
