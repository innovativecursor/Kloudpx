import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import logo from "../assets/kloudlogo.webp";

const PharmacistLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);
        const encodedCode = encodeURIComponent(codeResponse.code);
        const res = await axios.get(
          `http://localhost:10002/v1/auth/google/callback/pharmacist?code=${encodedCode}`
        );
        const { token } = res.data;
        if (token) {
          localStorage.setItem("access_token", token);
          navigate("/home");
        } else {
          throw new Error("Token missing");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Login failed", "error");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-sky-300 to-purple-200 flex items-center justify-center px-4">
      <div
        className="backdrop-blur-lg bg-white/70 border border-white/40 shadow-sm rounded-3xl 
      p-8 md:p-10 w-full max-w-md text-center"
      >
        <div className="mb-6">
          <img src={logo} alt="Logo" className="mx-auto w-20 h-16" />
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Pharmacist Panel
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Only authorized users can sign in
        </p>

        <button
          onClick={() => login()}
          disabled={loading}
          className="flex items-center justify-center gap-3 w-full py-3 px-6 bg-white text-gray-800 border border-gray-300 rounded-xl shadow-md hover:bg-gray-100 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Signing in...
            </>
          ) : (
            <>
              <i className="ri-google-fill text-xl text-[#0070BA]" />
              Sign in with Google
            </>
          )}
        </button>
        <p className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} Kloudpx. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default PharmacistLogin;
