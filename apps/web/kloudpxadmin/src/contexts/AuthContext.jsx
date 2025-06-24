import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import endpoints from "../config/endpoints";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("access_token")
  );
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || null
  );

  const [prescriptionRequired, setPrescriptionRequired] = useState(false);

  const [genericOptions, setGenericOptions] = useState([]);
  const [genericError, setGenericError] = useState("");

  const [supplierOptions, setSupplierOptions] = useState([]);
  const [supplierError, setSupplierError] = useState("");

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryError, setCategoryError] = useState("");

  const [medicines, setMedicines] = useState([]);
  const [medicineError, setMedicineError] = useState("");

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [imageIds, setImageIds] = useState([]);
  const [uploadedImageIds, setUploadedImageIds] = useState([]);

  // ---------------- AUTH FUNCTIONS ------------------
  const loginUser = (userData, token) => {
    localStorage.setItem("access_token", token);
    setUser(userData);
    setToken(token);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // ---------------- GENERIC FUNCTIONS ------------------
  const fetchGenericOptions = async () => {
    if (!token) {
      setGenericError("No token found, please login.");
      return;
    }

    try {
      const res = await axios.get(endpoints.generic.get, {
        headers: { Authorization: `${token}` },
      });
      const formatted = res.data.generics.map((item) => ({
        label: item.GenericName,
        value: item.ID,
      }));
      setGenericOptions(formatted);
      setGenericError("");
    } catch (err) {
      console.error("Error fetching generics:", err);
      setGenericError("Failed to load generics.");
    }
  };

  const createGenericOption = async (inputValue) => {
    if (!token) {
      setGenericError("Token missing, please login again.");
      return null;
    }

    try {
      const res = await axios.post(
        endpoints.generic.add,
        { genericname: inputValue },
        { headers: { Authorization: `${token}` } }
      );

      const createdGeneric = res.data.generic;

      const newOption = {
        value: createdGeneric.ID,
        label: createdGeneric.GenericName,
      };

      setGenericOptions((prev) => [...prev, newOption]);
      setGenericError("");
      return newOption;
    } catch (err) {
      console.error("Error creating generic:", err);
      setGenericError("Failed to add new generic.");
      return null;
    }
  };

  // ---------------- SUPPLIER FUNCTIONS ------------------

  const fetchSupplierOptions = async () => {
    if (!token) {
      setSupplierError("No token found, please login.");
      return;
    }

    try {
      const res = await axios.get(endpoints.supplier.get, {
        headers: { Authorization: `${token}` },
      });

      const formatted = res.data.suppliers.map((item) => ({
        label: item.SupplierName,
        value: item.ID,
      }));

      setSupplierOptions(formatted);
      setSupplierError("");
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setSupplierError("Failed to load suppliers.");
    }
  };

  const createSupplierOption = async (inputValue) => {
    if (!token) {
      setSupplierError("Token missing, please login again.");
      return null;
    }

    try {
      const res = await axios.post(
        endpoints.supplier.add,
        { suppliername: inputValue },
        { headers: { Authorization: `${token}` } }
      );

      const createdSupplier = res.data.supplier;

      const newOption = {
        value: createdSupplier.ID,
        label: createdSupplier.SupplierName,
      };

      setSupplierOptions((prev) => [...prev, newOption]);
      setSupplierError("");
      return newOption;
    } catch (err) {
      console.error("Error creating supplier:", err);
      setSupplierError("Failed to add new supplier.");
      return null;
    }
  };

  // ---------------- Category FUNCTIONS ------------------

  const fetchCategoryOptions = async () => {
    if (!token) {
      setCategoryError("No token found, please login.");
      return;
    }

    try {
      const res = await axios.get(endpoints.category.get, {
        headers: { Authorization: `${token}` },
      });

      const formatted = res.data.categories.map((item) => ({
        label: item.CategoryName,
        value: item.ID,
      }));

      setCategoryOptions(formatted);
      setCategoryError("");
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoryError("Failed to load categories.");
    }
  };

  const createCategoryOption = async (inputValue) => {
    if (!token) {
      setCategoryError("Token missing, please login again.");
      return null;
    }

    try {
      const res = await axios.post(
        endpoints.category.add,
        { category: inputValue },
        { headers: { Authorization: `${token}` } }
      );

      const createdCategory = res.data.category;

      const newOption = {
        value: createdCategory.ID,
        label: createdCategory.CategoryName,
      };

      setCategoryOptions((prev) => [...prev, newOption]);
      setCategoryError("");
      return newOption;
    } catch (err) {
      console.error("Error creating category:", err);
      setCategoryError("Failed to add new category.");
      return null;
    }
  };

  // ---------------- get medicine FUNCTIONS ------------------

  const getAllMedicines = async () => {
    if (!token) {
      setMedicineError("Token missing, please login.");
      return;
    }

    try {
      const res = await axios.get(endpoints.medicine.getAll, {
        headers: { Authorization: `${token}` },
      });

      setMedicines(res.data.medicines || []);
      setMedicineError("");
    } catch (err) {
      console.error("Error fetching medicines:", err);
      setMedicineError("Failed to fetch medicines.");
    }
  };

  // ---------------- images FUNCTIONS ------------------

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (images.length + selectedFiles.length > 5) {
      setMessage("❌ Max 5 images allowed.");
      return;
    }

    const newImages = [...images, ...selectedFiles];
    setImages(newImages);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviews]);

    setMessage("");
  };

  const handleUpload = async (e, itemId) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("item_id", itemId || "0");
      images.forEach((image) => formData.append("images", image));

      const response = await axios.post(endpoints.itemimage.add, formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedIds = response.data.image_ids;
      setUploadedImageIds((prev) => [...prev, ...uploadedIds]);
      setMessage("✅ Images uploaded successfully!");

      setImages([]);
      setPreviewUrls([]);
    } catch (error) {
      console.error(error);
      setMessage("❌ Image upload failed.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginUser,
        logoutUser,
        prescriptionRequired,
        setPrescriptionRequired,
        token,
        genericOptions,
        genericError,
        fetchGenericOptions,
        createGenericOption,
        supplierOptions,
        supplierError,
        fetchSupplierOptions,
        createSupplierOption,
        fetchCategoryOptions,
        createCategoryOption,
        categoryOptions,
        categoryError,
        medicines,
        medicineError,
        getAllMedicines,
        handleUpload,
        handleImageChange,
        images,
        previewUrls,
        message,
        imageIds,
        uploadedImageIds,
        setUploadedImageIds,
        setPreviewUrls,
        setMessage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);
