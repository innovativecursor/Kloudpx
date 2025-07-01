"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import axios from "axios";
import { useRouter } from "next/navigation";
import endpoints from "@/app/config/endpoints";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await axios.get(endpoints.auth.getCurrentUser, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user info", err);
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        if (!codeResponse?.code)
          throw new Error("Authorization code not found");
        const encodedCode = encodeURIComponent(codeResponse.code);
        const res = await axios.get(
          endpoints.auth.googleLogin + `?code=${encodedCode}`
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
    setUser(null);
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
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
