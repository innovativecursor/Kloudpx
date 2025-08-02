import { createContext, useContext, useState, useEffect } from "react";
import {
  getAxiosCall,
  deleteAxiosCall,
  postAxiosCall,
} from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import endpoints from "../config/endpoints";
import axios from "axios";

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

  const handleDownloadExcel = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(endpoints.download.get, {
        responseType: "blob",
        headers: {
          Authorization: `${token}`,
          Accept: "*/*",
        },
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "medicine_data.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Excel download failed", error);
      Swal.fire({
        title: "Error",
        text: "Download failed. Try again!",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <GetDataContext.Provider
      value={{
        medicines,
        fetchMedicines,
        deleteMedicine,
        uploadExcel,
        handleDownloadExcel,
      }}
    >
      {children}
    </GetDataContext.Provider>
  );
};

export default GetDataProvider;
export const useGetDataContext = () => useContext(GetDataContext);
