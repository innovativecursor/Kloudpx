import { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall } from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
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

  useEffect(() => {
    const initializeUser = async () => {
      if (!token || token === "null" || token.trim() === "") return;
      if (!isAuthenticated) return;

      if (!user) {
        try {
          const adminInfo = await fetchAdminInfo();
          if (adminInfo) {
            setUser(adminInfo);
          } else {
            logoutUser();
          }
        } catch (error) {
          console.error("initializeUser error:", error);
        }
      }
    };

    initializeUser();
  }, [token, isAuthenticated]);

  // --------- AUTH FUNCTIONS ---------

  const fetchAdminInfo = async () => {
    if (!token) {
      return null;
    }
    try {
      const res = await getAxiosCall(endpoints.admininfo.get);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);
