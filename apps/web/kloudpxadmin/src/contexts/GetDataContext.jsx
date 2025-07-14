import { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall, deleteAxiosCall } from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";

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
      console.log("✅ Deleted:", res);

      setMedicines((prev) => prev.filter((item) => item.ID !== id));

      await Swal.fire("Deleted!", "The medicine has been deleted.", "success");
    } catch (error) {
      console.error("❌ Delete failed:", error);
      // Error Swal already shown in deleteAxiosCall
    }
  };

  return (
    <GetDataContext.Provider
      value={{ medicines, fetchMedicines, deleteMedicine }}
    >
      {children}
    </GetDataContext.Provider>
  );
};

export default GetDataProvider;
export const useGetDataContext = () => useContext(GetDataContext);
