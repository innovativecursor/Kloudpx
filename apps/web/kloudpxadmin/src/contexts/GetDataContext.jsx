import { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall, deleteAxiosCall } from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import axios from "axios";
import { store } from "@store";

export const GetDataContext = createContext();

const GetDataProvider = ({ children }) => {
  const [medicines, setMedicines] = useState([]);

  // 🔹 Fetch all medicines
  const fetchMedicines = async () => {
    try {
      const res = await getAxiosCall("/v1/medicine/get-all-medicine");
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
      const res = await deleteAxiosCall("/v1/medicine/delete-medicine", id);
      // console.log("✅ Deleted:", res);

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

    try {
      store.dispatch({ type: "LOADING", payload: true });

      const token = localStorage.getItem("access_token");
      const instance = axios.create({
        baseURL: "http://localhost:10001",
        headers: {
          Authorization: `${token}`,
          Accept: "*/*",
        },
      });

      const res = await instance.post("/v1/excel/upload-excel", formData);

      Swal.fire({
        icon: "success",
        title: "Upload Successful",
        text: res.data?.message || "Excel file uploaded successfully",
      });

      fetchMedicines();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: error?.response?.data?.error || "Something went wrong",
      });
    } finally {
      store.dispatch({ type: "LOADING", payload: false });
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
