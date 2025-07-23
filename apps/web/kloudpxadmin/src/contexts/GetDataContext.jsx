import { createContext, useContext, useState, useEffect } from "react";
import {
  getAxiosCall,
  deleteAxiosCall,
  postAxiosCall,
} from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import endpoints from "../config/endpoints";

export const GetDataContext = createContext();

const GetDataProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  // 🔹 Fetch all medicines
  const fetchMedicines = async () => {
    try {
      const res = await getAxiosCall(endpoints.medicine.getAll);
      if (res?.data?.medicines) {
        setMedicines(res.data.medicines);
      }
    } catch (error) {
      Swal.fire("Error", "Failed to fetch medicines.", "error");
    }
  };

  // 🔹 Delete a medicine
  const deleteMedicine = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this medicine?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await deleteAxiosCall(endpoints.medicine.delete(id));

      setMedicines((prev) => prev.filter((item) => item.ID !== id));

      await Swal.fire("Deleted!", "The medicine has been deleted.", "success");
    } catch (error) {
      console.error("❌ Delete failed:", error);
    }
  };

  const uploadExcel = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const res = await postAxiosCall(endpoints.uploadExcel.add, formData);

    if (res?.message) {
      Swal.fire({
        icon: "success",
        title: "Upload Successful",
        text: res.message,
      });
      fetchMedicines();
    }
  };

  return (
    <GetDataContext.Provider
      value={{ medicines, fetchMedicines, deleteMedicine, uploadExcel }}
    >
      {children}
    </GetDataContext.Provider>
  );
};

export default GetDataProvider;
export const useGetDataContext = () => useContext(GetDataContext);
