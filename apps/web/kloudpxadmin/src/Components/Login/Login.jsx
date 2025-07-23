import { useGoogleLogin } from "@react-oauth/google";
import { useAuthContext } from "../../contexts/AuthContext";
import logo from "../../assets/Images/kloudlogo.webp";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { useState } from "react";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import endpoints from "../../config/endpoints";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuthContext();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      setLoading(true);
      try {
        const res = await getAxiosCall(endpoints.auth.googleLogin, {
          code: codeResponse.code,
        });

        const { token, user } = res?.data || {};

        if (token) {
          loginUser(user, token);
          navigate("/home");
        } else {
          throw new Error("Invalid token response");
        }
      } catch (error) {
        console.error("Login error:", error);
        Swal.fire(
          "Login Failed",
          "Google Login did not complete successfully",
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-sky-300 to-purple-200 flex items-center justify-center px-4">
      <div className="backdrop-blur-md bg-white/70 border border-white/30 shadow-lg rounded-3xl p-6 sm:p-10 w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to Kloud
        </h2>
        <div className="px-4">
          <button
            onClick={() => login()}
            disabled={loading}
            className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-white text-gray-800 border border-gray-300 rounded-xl shadow-md hover:bg-gray-100 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed text-base font-medium"
          >
            <i className="ri-google-fill text-xl text-[#0070BA]"></i>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-500">
          Only authorized administrators can access this panel.
        </p>
      </div>
    </div>
  );
};

export default Login;