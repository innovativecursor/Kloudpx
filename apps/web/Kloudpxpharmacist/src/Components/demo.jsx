import React, { createContext, useContext, useState, useEffect } from "react";
import { getAxiosCall } from "../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("access_token") || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  // Fetch admin info using token via getAxiosCall (which attaches Authorization header)
  const fetchAdminInfo = async () => {
    try {
      const res = await getAxiosCall("/v1/admin/admin-info");
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

  // Login user: store token, set authenticated, fetch full user info
  const loginUser = async (userData, token) => {
    localStorage.setItem("access_token", token);
    setToken(token);
    setIsAuthenticated(true);

    const adminInfo = await fetchAdminInfo();
    if (adminInfo) {
      setUser(adminInfo);
    } else {
      setUser(userData); // fallback if admin-info API fails
    }
  };

  // Logout user: clear everything
  const logoutUser = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Auto-fetch user info when token changes (e.g. page refresh)
  useEffect(() => {
    if (token) {
      fetchAdminInfo().then((adminInfo) => {
        if (adminInfo) setUser(adminInfo);
        else setUser(null);
      });
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);
