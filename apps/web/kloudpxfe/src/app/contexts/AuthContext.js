"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { getAxiosCall } from "@/app/lib/axios";
import endpoints from "@/app/config/endpoints";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("access_token");
      // const t = sessionStorage.getItem("access_token");
      setToken(t);
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await getAxiosCall(endpoints.auth.getCurrentUser, {}, true);
        setUser(res?.data);
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
        if (!codeResponse?.code)
          throw new Error("Authorization code not found");
        const encodedCode = encodeURIComponent(codeResponse.code);
        const res = await getAxiosCall(
          endpoints.auth.googleLogin + `?code=${encodedCode}`
        );
        // console.log(res);
        const token = res?.data?.token;
        if (!token) throw new Error("Token missing from server");

        localStorage.setItem("access_token", token);
        // sessionStorage.setItem("access_token", token);
        setToken(token);

        router.push("/");
      } catch (error) {
        console.error("Login failed", error.message);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  const logout = () => {
    localStorage.removeItem("access_token");
    // sessionStorage.removeItem("access_token");
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
        isAuthenticated: !!token,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
