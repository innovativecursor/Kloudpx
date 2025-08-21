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
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("access_token");
      if (t && t !== "null") {
        setToken(t);
      }
      setIsAuthLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
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
        const token = res?.data?.token;
        if (!token) throw new Error("Token missing from server");

        localStorage.setItem("access_token", token);
        setToken(token);

        router.push("/");
      } catch (error) {
        console.error("Login failed", error.message);
      }
    },
    // onError: () => {
    //   console.error("Google login failed");
    // },
  });

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        setToken,
        setUser,
        // logout,
        isAuthenticated: !!token,
        user,
        isAuthLoaded,
      }}
    >
      {/* {children} */}
      {isAuthLoaded ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
