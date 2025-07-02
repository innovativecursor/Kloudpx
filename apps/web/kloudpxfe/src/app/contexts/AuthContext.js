"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import endpoints from "@/app/config/endpoints";
import DashboardLoading from "../components/Loader/DashboardLoader";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("access_token");
      setToken(t);
    }
  }, []);

  // const [token, setToken] = useState(
  //   typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  // );

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

        router.push("/");
      } catch (error) {
        console.error("Login failed", error.message);
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
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
      {loading && <DashboardLoading />}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
