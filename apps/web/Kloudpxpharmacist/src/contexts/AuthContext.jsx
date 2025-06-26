import { createContext, useContext, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import endpoints from "../config/endpoints";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("access_token") || null
  );

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        if (!codeResponse?.code)
          throw new Error("Authorization code not found");

        const encodedCode = encodeURIComponent(codeResponse.code);
        const res = await axios.get(
          // `http://localhost:10002/v1/auth/google/callback/pharmacist?code=${encodedCode}`
          `${endpoints.auth.googleLoginPharmacist}?code=${encodedCode}`
        );

        const { token } = res.data;
        if (!token) throw new Error("Token missing from server");

        localStorage.setItem("access_token", token);
        setToken(token);
        Swal.fire("Success", "Login successful", "success");
        navigate("/home");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", error.message || "Login failed", "error");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      Swal.fire("Error", "Google login failed", "error");
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    Swal.fire("Logged Out", "You have been logged out", "info");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);
