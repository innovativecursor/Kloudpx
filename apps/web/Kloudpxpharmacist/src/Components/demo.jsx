import { createContext, useContext, useState } from "react";
import { getAxiosCall, postAxiosCall } from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";

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

  // --------- AUTH FUNCTIONS ---------
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

  // --------- HELPER: check token ---------
  const checkToken = () => {
    if (!token) {
      Swal.fire({
        title: "Error",
        text: "Authentication token missing, please login again.",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return false;
    }
    return true;
  };

  // --------- GENERIC OPTIONS ---------
  const fetchGenericOptions = async () => {
    if (!checkToken()) {
      setGenericError("No token found, please login.");
      return;
    }
    try {
      const res = await getAxiosCall("/v1/generic/get-generic");
      if (res?.data?.generics) {
        const formatted = res.data.generics.map((item) => ({
          label: item.GenericName,
          value: item.ID,
        }));
        setGenericOptions(formatted);
        setGenericError("");
      } else {
        setGenericError("Failed to load generics.");
      }
    } catch (error) {
      setGenericError("Failed to load generics.");
    }
  };

  const createGenericOption = async (inputValue) => {
    if (!checkToken()) {
      setGenericError("Token missing, please login again.");
      return null;
    }
    try {
      const res = await postAxiosCall("/v1/generic/add-generic", {
        genericname: inputValue,
      });

      if (res?.generic) {
        const createdGeneric = res.generic;
        const newOption = {
          value: createdGeneric.ID,
          label: createdGeneric.GenericName,
        };
        setGenericOptions((prev) => [...prev, newOption]);
        setGenericError("");
        return newOption;
      } else {
        setGenericError("Failed to add new generic.");
        return null;
      }
    } catch (error) {
      setGenericError("Failed to add new generic.");
      return null;
    }
  };

  // --------- SUPPLIER OPTIONS ---------
  const fetchSupplierOptions = async () => {
    if (!checkToken()) {
      setSupplierError("No token found, please login.");
      return;
    }
    try {
      const res = await getAxiosCall("/v1/supplier/get-all-supplier");
      if (res?.data?.suppliers) {
        const formatted = res.data.suppliers.map((item) => ({
          label: item.SupplierName,
          value: item.ID,
        }));
        setSupplierOptions(formatted);
        setSupplierError("");
      } else {
        setSupplierError("Failed to load suppliers.");
      }
    } catch (error) {
      setSupplierError("Failed to load suppliers.");
    }
  };

  const createSupplierOption = async (inputValue) => {
    if (!checkToken()) {
      setSupplierError("Token missing, please login again.");
      return null;
    }
    try {
      const res = await postAxiosCall("/v1/supplier/add-supplier", {
        suppliername: inputValue,
      });
      if (res?.supplier) {
        const createdSupplier = res.supplier;
        const newOption = {
          value: createdSupplier.ID,
          label: createdSupplier.SupplierName,
        };
        setSupplierOptions((prev) => [...prev, newOption]);
        setSupplierError("");
        return newOption;
      } else {
        setSupplierError("Failed to add new supplier.");
        return null;
      }
    } catch (error) {
      setSupplierError("Failed to add new supplier.");
      return null;
    }
  };

  // --------- CATEGORY OPTIONS ---------
  const fetchCategoryOptions = async () => {
    if (!checkToken()) {
      setCategoryError("No token found, please login.");
      return;
    }
    try {
      const res = await getAxiosCall("/v1/category/get-all-category");

      if (res?.data?.categories) {
        const formatted = res.data.categories.map((item) => ({
          label: item.CategoryName,
          value: item.ID,
        }));
        setCategoryOptions(formatted);
        setCategoryError("");
      } else {
        setCategoryError("Failed to load categories.");
      }
    } catch (error) {
      setCategoryError("Failed to load categories.");
    }
  };

  const createCategoryOption = async (inputValue) => {
    if (!checkToken()) {
      setCategoryError("Token missing, please login again.");
      return null;
    }
    try {
      const res = await postAxiosCall("/v1/category/add-category", {
        category: inputValue,
      });

      if (res?.category) {
        const createdCategory = res.category;
        const newOption = {
          value: createdCategory.ID,
          label: createdCategory.CategoryName,
        };
        setCategoryOptions((prev) => [...prev, newOption]);
        setCategoryError("");
        return newOption;
      } else {
        setCategoryError("Failed to add new category.");
        return null;
      }
    } catch (error) {
      setCategoryError("Failed to add new category.");
      return null;
    }
  };

  // --------- MEDICINES ---------
  const getAllMedicines = async () => {
    if (!checkToken()) {
      setMedicineError("Token missing, please login.");
      return;
    }
    try {
      const res = await getAxiosCall("/v1/medicine/get-all-medicine");
      if (res?.data?.medicines) {
        setMedicines(res.data.medicines);
        setMedicineError("");
      } else {
        setMedicineError("Failed to fetch medicines.");
      }
    } catch (error) {
      setMedicineError("Failed to fetch medicines.");
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

        categoryOptions,
        categoryError,
        fetchCategoryOptions,
        createCategoryOption,

        medicines,
        medicineError,
        getAllMedicines,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);  
eska  GENERIC OPTIONS, SUPPLIER OPTIONS, CATEGORY OPTIONS 
ka sara code dropdownContext me rkh