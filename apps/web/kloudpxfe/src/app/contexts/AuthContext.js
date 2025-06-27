"use client";

import { createContext, useContext, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
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
          `http://localhost:10003/v1/auth/google/callback/user?code=${encodedCode}`
        );

        const { token } = res.data;
        if (!token) throw new Error("Token missing from server");

        localStorage.setItem("access_token", token);
        setToken(token);
        Swal.fire("Success", "Login successful", "success");
        router.push("/");
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
    router.push("/");
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

export const useAuthContext = () => useContext(AuthContext);
