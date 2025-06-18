import { useGoogleLogin } from "@react-oauth/google";
import logo from "../../../public/kloudlogo.webp";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import { connect } from "react-redux";
import axios from "axios";
import endpoints from "../../config/endpoints";
import { fetchDataGet } from "../../utils/fetchData";

const Login = (props) => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const url = endpoints.auth.googleLogin;
        const params = { code: codeResponse.code };

        const { token, user } = await fetchDataGet(url, params);

        if (token) {
          // Store token
          localStorage.setItem("access_token", token);
          props.isLoggedIn(user);
          // Navigate
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
            className="flex items-center justify-center gap-3 py-2 border border-gray-300 font-semibold rounded-md w-full text-lg hover:bg-gray-100 transition"
          >
            <i className="ri-google-fill"></i>
            Continue with Google
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
