import { useGoogleLogin } from "@react-oauth/google";
import logo from "../../../public/kloudlogo.webp";
import { getAxiosCall, postAxiosCall } from "../../Axios/UniversalAxiosCalls";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router";
import { connect } from "react-redux";

const Login = () => {
  // const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Token Response:", tokenResponse);
        const result = await getAxiosCall("/auth/oauth/callback", {
          code: tokenResponse?.code,
        });
        console.log("API Result:", result);
        const real = await postAxiosCall("/auth/admin/oauth", {
          access_token: result?.data?.access_token,
        });
        console.log("API oauth admin login :", real);

        if (result) {
          localStorage.setItem("access_token", result?.code);
          // props?.isLoggedIn(result?.user);
          // navigate("/home");
        }
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error",
          text: error.message || "OAuth callback failed",
          icon: "error",
          confirmButtonText: "Alright!",
          allowOutsideClick: false,
        });
      }
    },
    flow: "auth-code",
    onError: (error) => {
      console.error("Google Login Error:", error);
      Swal.fire({
        title: "Login Failed",
        text: error?.error || "Something went wrong during login",
        icon: "error",
        confirmButtonText: "Alright!",
        allowOutsideClick: false,
      });
    },
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
