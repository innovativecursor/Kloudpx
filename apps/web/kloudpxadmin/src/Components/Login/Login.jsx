import { useGoogleLogin } from "@react-oauth/google";
import logo from "../../../public/kloudlogo.webp";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { connect } from "react-redux";
import axios from "axios";
import endpoints from "../../config/endpoints";
import { fetchDataGet } from "../../utils/fetchData";
import { useState } from "react";

const Login = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const tokenResponse = await axios.get(
          // http://localhost:10001/v1/auth/google/callback?code=${codeResponse.code}
          `http://localhost:10001/v1/auth/google/callback?code=${codeResponse.code}`
        );

        const { token, user } = tokenResponse.data;

        if (token) {
          localStorage.setItem("access_token", token);

          props.isLoggedIn(user);

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
      }
    },
    flow: "auth-code",
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-homexbg bg-opacity-30">
      <div className="bg-white py-6 border rounded-xl shadow-2xl w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-20" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">kloud</h2>
        <div className="mx-6">
          <button
            onClick={() => login()}
            disabled={loading}
            className="flex items-center justify-center gap-3 py-2 border border-gray-300 font-semibold rounded-md w-full text-lg hover:bg-gray-100 transition disabled:opacity-60"
          >
            <i className="ri-google-fill"></i>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Only authorized administrators can access this panel
        </p>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    isLoggedIn: (sendUserInfo) =>
      dispatch({ type: "LOGGEDIN", payload: sendUserInfo }),
  };
};

export default connect(null, mapDispatchToProps)(Login);
