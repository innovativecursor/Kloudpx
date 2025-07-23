import { createContext, useContext, useState } from "react";
import { getAxiosCall, postAxiosCall } from "../Axios/UniversalAxiosCalls";
import { useAuthContext } from "./AuthContext";
import endpoints from "../config/endpoints";

export const DropdownContext = createContext();

const DropdownProvider = ({ children }) => {
  const { checkToken } = useAuthContext();

  // GENERIC
  const [genericOptions, setGenericOptions] = useState([]);
  const [selectedGeneric, setSelectedGeneric] = useState(null);

  const fetchGenericOptions = async () => {
    if (!checkToken()) return;
    try {
      const res = await getAxiosCall(endpoints.generic.get);
      const data = res?.data?.generics || [];
      const formatted = data.map((item) => ({
        label: item.GenericName,
        value: item.ID,
      }));
      setGenericOptions(formatted);
    } catch {}
  };

  const createGenericOption = async (inputValue) => {
    if (!checkToken()) return null;
    try {
      const res = await postAxiosCall(endpoints.generic.add, {
        genericname: inputValue,
      });
      const created = res?.generic;
      if (created) {
        const newOption = {
          value: created.ID,
          label: created.GenericName,
        };
        setGenericOptions((prev) => [...prev, newOption]);
        setSelectedGeneric(newOption);
        return newOption;
      }
    } catch {
      return null;
    }
  };

  // SUPPLIER
  const [supplierOptions, setSupplierOptions] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const fetchSupplierOptions = async () => {
    if (!checkToken()) return;
    try {
      const res = await getAxiosCall(endpoints.supplier.get);
      const data = res?.data?.suppliers || [];
      const formatted = data.map((item) => ({
        label: item.SupplierName,
        value: item.ID,
      }));
      setSupplierOptions(formatted);
    } catch {}
  };

  const createSupplierOption = async (inputValue) => {
    if (!checkToken()) return null;
    try {
      const res = await postAxiosCall(endpoints.supplier.add, {
        suppliername: inputValue,
      });
      const created = res?.supplier;
      if (created) {
        const newOption = {
          value: created.ID,
          label: created.SupplierName,
        };
        setSupplierOptions((prev) => [...prev, newOption]);
        setSelectedSupplier(newOption);
        return newOption;
      }
    } catch {
      return null;
    }
  };

  return (
    <DropdownContext.Provider
      value={{
        // Generic
        genericOptions,
        selectedGeneric,
        setSelectedGeneric,
        fetchGenericOptions,
        createGenericOption,

        // Supplier
        supplierOptions,
        selectedSupplier,
        setSelectedSupplier,
        fetchSupplierOptions,
        createSupplierOption,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
};

export default DropdownProvider;
export const useDropdownContext = () => useContext(DropdownContext);
