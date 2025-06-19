import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
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
  const [genericOptions, setGenericOptions] = useState([]);
  const [genericError, setGenericError] = useState("");

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

  // const fetchGenericOptions = async () => {
  //   if (!token) {
  //     setGenericError("No token found, please login.");
  //     return;
  //   }

  //   try {
  //     const res = await axios.get(endpoints.generic.get, {
  //       headers: {
  //         Authorization: `${token}`,
  //       },
  //     });
  //     const formatted = res.data.generics.map((item) => ({
  //       label: item.GenericName,
  //       value: item.GenericName,
  //     }));
  //     setGenericOptions(formatted);
  //     setGenericError("");
  //   } catch (err) {
  //     console.error("Error fetching generics:", err);
  //     setGenericError("Failed to load generics.");
  //   }
  // };





  const fetchGenericOptions = async () => {
  if (!token) {
    setGenericError("No token found, please login.");
    return;
  }

  try {
    const res = await axios.get(endpoints.generic.get, {
      headers: {
        Authorization: `${token}`,
      },
    });
    const formatted = res.data.generics.map((item) => ({
      label: item.GenericName,
      value: item.ID, 
    }));
    setGenericOptions(formatted);
    setGenericError("");
  } catch (err) {
    console.error("Error fetching generics:", err);
    setGenericError("Failed to load generics.");
  }
};









  const createGenericOption = async (inputValue) => {
    if (!token) {
      setGenericError("Token missing, please login again.");
      return;
    }

    try {
      await axios.post(
        endpoints.generic.add,
        { genericname: inputValue },
        { headers: { Authorization: `${token}` } }
      );

      const newOption = { value: inputValue, label: inputValue };
      setGenericOptions((prev) => [...prev, newOption]);
      setGenericError("");
      return newOption;
    } catch (err) {
      console.error("Error creating generic:", err);
      setGenericError("Failed to add new generic.");
      return null;
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

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);
