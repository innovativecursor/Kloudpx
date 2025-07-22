import { createContext, useContext, useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import endpoints from "../config/endpoints";
import { getAxiosCall } from "../Axios/AxiosConfig";
import { store } from "../store/index";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(
    sessionStorage.getItem("access_token") || null
  );

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      try {
        const res = await getAxiosCall(endpoints.auth.getCurrentUser, {}, true);

        setUser(res);
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

        const response = await getAxiosCall(
          `${endpoints.auth.googleLoginPharmacist}?code=${codeResponse.code}`,
          {},
          false
        );

        const { token } = response;
        if (!token) throw new Error("Token missing from server");

        sessionStorage.setItem("access_token", token);
        setToken(token);
        navigate("/home");
      } catch (error) {
        console.error(error);
        Swal.fire("Error", error.message || "Login failed", "error");
      }
    },
    onError: () => {
      Swal.fire("Error", "Google login failed", "error");
    },
  });

  const logout = () => {
    store.dispatch({ type: "LOADING", payload: true });

    setTimeout(() => {
      sessionStorage.removeItem("access_token");
      setToken(null);
      store.dispatch({ type: "LOADING", payload: false });
      navigate("/");
    }, 500);
  };

  const isUserLoggedIn = !!token;




  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isUserLoggedIn,
        user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuthContext = () => useContext(AuthContext);
