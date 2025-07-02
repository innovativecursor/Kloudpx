import { createContext, useContext, useState } from "react";
import { getAxiosCall, postAxiosCall } from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import { useAuthContext } from "./AuthContext";

export const DropdownContext = createContext();

const DropdownProvider = ({ children }) => {
  const { token, checkToken } = useAuthContext();
  // Dropdown States
  const [genericOptions, setGenericOptions] = useState([]);
  const [genericError, setGenericError] = useState("");

  const [supplierOptions, setSupplierOptions] = useState([]);
  const [supplierError, setSupplierError] = useState("");

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryError, setCategoryError] = useState("");

  // --------- GENERIC ---------
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
        const created = res.generic;
        const newOption = { value: created.ID, label: created.GenericName };
        setGenericOptions((prev) => [...prev, newOption]);
        setGenericError("");
        return newOption;
      } else {
        setGenericError("Failed to add new generic.");
        return null;
      }
    } catch {
      setGenericError("Failed to add new generic.");
      return null;
    }
  };

  // --------- SUPPLIER ---------
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
    } catch {
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
        const created = res.supplier;
        const newOption = { value: created.ID, label: created.SupplierName };
        setSupplierOptions((prev) => [...prev, newOption]);
        setSupplierError("");
        return newOption;
      } else {
        setSupplierError("Failed to add new supplier.");
        return null;
      }
    } catch {
      setSupplierError("Failed to add new supplier.");
      return null;
    }
  };

  // --------- CATEGORY ---------
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
    } catch {
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
      console.log(res);

      if (res?.category) {
        const created = res.category;
        const newOption = { value: created.ID, label: created.CategoryName };
        setCategoryOptions((prev) => [...prev, newOption]);
        setCategoryError("");
        return newOption;
      } else {
        setCategoryError("Failed to add new category.");
        return null;
      }
    } catch {
      setCategoryError("Failed to add new category.");
      return null;
    }
  };

  return (
    <DropdownContext.Provider
      value={{
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
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export default DropdownProvider;
export const useDropdownContext = () => useContext(DropdownContext);
