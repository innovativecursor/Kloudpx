// import { useGoogleLogin } from "@react-oauth/google";
// import logo from "../../../public/kloudlogo.webp";
// import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router";
// import { connect } from "react-redux";

// const Login = (props) => {
//   const navigate = useNavigate();

//   const login = useGoogleLogin({
//     onSuccess: async (tokenResponse) => {
//       try {
//         console.log("Token Response:", tokenResponse);

//         const result = await getAxiosCall("/auth/oauth/callback", {
//           code: tokenResponse?.code,
//         });

//         console.log("API Result:", result);

//         if (result) {
//           localStorage.setItem("access_token", result?.code);
//           props?.isLoggedIn(result?.user);
//           navigate("/home");
//         }
//       } catch (error) {
//         console.error(error);
//         Swal.fire({
//           title: "Error",
//           text: error.message || "OAuth callback failed",
//           icon: "error",
//           confirmButtonText: "Alright!",
//           allowOutsideClick: false,
//         });
//       }
//     },
//     flow: "auth-code",
//     onError: (error) => {
//       console.error("Google Login Error:", error);
//       Swal.fire({
//         title: "Login Failed",
//         text: error?.error || "Something went wrong during login",
//         icon: "error",
//         confirmButtonText: "Alright!",
//         allowOutsideClick: false,
//       });
//     },
//   });

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-homexbg bg-opacity-30">
//       <div className="bg-white py-6 border rounded-xl shadow-2xl w-full max-w-md text-center">
//         <div className="flex justify-center mb-4">
//           <img src={logo} alt="Logo" className="w-20" />
//         </div>
//         <h2 className="text-2xl font-semibold mb-4">kloud</h2>
//         <div className="mx-6">
//           <button
//             onClick={() => login()}
//             className="flex items-center justify-center gap-3 py-2 border border-gray-300 font-semibold rounded-md w-full text-lg hover:bg-gray-100 transition"
//           >
//             <i className="ri-google-fill"></i>
//             Continue with Google
//           </button>
//         </div>
//         <p className="mt-4 text-sm text-gray-500">
//           Only authorized administrators can access this panel
//         </p>
//       </div>
//     </div>
//   );
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     isLoggedIn: (sendUserInfo) =>
//       dispatch({ type: "LOGGEDIN", payload: sendUserInfo }),
//   };
// };

// export default connect(null, mapDispatchToProps)(Login);









































import { useGoogleLogin } from "@react-oauth/google";
import logo from "../../../public/kloudlogo.webp";
import { useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      try {
        console.log("Google token response:", tokenResponse);

        const response = await axios.get(
          `http://localhost:10001/v1/auth/google`,
          {
            params: { code: tokenResponse.code },
            withCredentials: true,
          }
        );

        if (response?.data?.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
          Swal.fire("Success", "Login successful!", "success");
          window.location.reload();
        } else {
          throw new Error("Invalid backend login response");
        }
      } catch (error) {
        console.error("Login error:", error);
        Swal.fire("Error", error?.message || "Something went wrong during login.", "error");
      } finally {
        setLoading(false);
      }
    },

    onError: (error) => {
      console.error("Google Login Error:", error);
      Swal.fire("Login Failed", error?.error || "Google authentication failed.", "error");
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

export default Login;
