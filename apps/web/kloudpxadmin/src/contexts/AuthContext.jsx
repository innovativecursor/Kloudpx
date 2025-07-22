import { createContext, useContext, useState } from "react";
import { getAxiosCall } from "../Axios/UniversalAxiosCalls";
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

  const [medicines, setMedicines] = useState([]);
  const [medicineError, setMedicineError] = useState("");

  // --------- AUTH FUNCTIONS ---------



  const fetchAdminInfo = async () => {
    try {
      const res = await getAxiosCall("/v1/admin/admin-info");
      // console.log(res, "res");

      if (res && res.data) {
        return res.data;
      } else {
        throw new Error("Failed to fetch admin info");
      }
    } catch (error) {
      console.error("fetchAdminInfo error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to fetch admin info. Please login again.",
        icon: "error",
        confirmButtonText: "OK",
        allowOutsideClick: false,
      });
      return null;
    }
  };



  const loginUser = async (userData, token) => {
    localStorage.setItem("access_token", token);
    setToken(token);
    setIsAuthenticated(true);

    const adminInfo = await fetchAdminInfo();
    if (adminInfo) {
      setUser(adminInfo);
    } else {
      setUser(userData);
    }
  };

  // const loginUser = (userData, token) => {
  //   localStorage.setItem("access_token", token);
  //   setUser(userData);
  //   setToken(token);
  //   setIsAuthenticated(true);
  // };

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

  // console.log(user);


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
        checkToken,
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