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
// import { useGoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import logo from "/kloudlogo.webp"; // Use public/ path

// const Login = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const login = useGoogleLogin({
//     flow: "auth-code",
//     onSuccess: async (tokenResponse) => {
//       console.log("✅ Google Auth code:", tokenResponse.code);
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           "http://localhost:10001/v1/auth/google/callback",
//           {
//             params: { code: tokenResponse.code },
//             withCredentials: true,
//           }
//         );

//         if (response.data?.jwtoken) {
//           localStorage.setItem("access_token", response.data.jwtoken);
//           Swal.fire("Success", "Login successful!", "success");
//           window.location.reload();
//         } else {
//           throw new Error("Invalid backend response");
//         }
//       } catch (err) {
//         console.error("❌ Login failed:", err);
//         Swal.fire("Error", err.message, "Something went wrong.");
//       } finally {
//         setLoading(false);
//       }
//     },
//     onError: (error) => {
//       console.error("❌ Google Login Error:", error);
//       Swal.fire("Login Failed", error.error, "Google authentication failed.");
//     },
//   });

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white shadow-lg p-6 rounded-md w-full max-w-md text-center">
//         <img src={logo} alt="Logo" className="w-20 mx-auto mb-4" />
//         <h2 className="text-xl font-bold mb-4">Login to Kloud</h2>
//         <button
//           onClick={login}
//           disabled={loading}
//           className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
//         >
//           {loading ? "Signing in..." : "Continue with Google"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Login;

// GoogleLoginPage.jsx
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";
// import logo from "../../../public/kloudlogo.webp"; 

// const GoogleLoginPage = () => {
//   const navigate = useNavigate();
//   const [isCallback, setIsCallback] = useState(false);

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const code = urlParams.get("code");

//     if (code) {
//       setIsCallback(true);
//       fetchGoogleUser(code);
//     }
//   }, []);

//   const fetchGoogleUser = async (code) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:10001/v1/auth/google/callback?code=${code}`
//       );

//       const { jwtoken, email, firstName } = response.data;

//       localStorage.setItem("token", jwtoken);

//       Swal.fire("Success", `Logged in as ${firstName} (${email})`, "success");

//       navigate("/dashboard");
//     } catch (err) {
//       console.error("Callback error:", err);
//       Swal.fire("Error", "Google login failed", "error");
//       navigate("/");
//     }
//   };

//   const handleGoogleLogin = async () => {
//     try {
//       const response = await axios.get("http://localhost:10001/v1/auth/google");
//       const redirectUrl = response.data.redirect_url;

//       if (redirectUrl) {
//         window.location.href = redirectUrl;
//       } else {
//         Swal.fire("Error", "Unable to get Google login URL", "error");
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       Swal.fire("Error", "Failed to start Google login", "error");
//     }
//   };

//   if (isCallback) {
//     return <div>Logging in with Google...</div>;
//   }

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <img src={logo} alt="Logo" width="200" />
//       <h2>Welcome! Please sign in</h2>
//       <button
//         onClick={handleGoogleLogin}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#4285F4",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           fontSize: "16px",
//           cursor: "pointer",
//           marginTop: "20px",
//         }}
//       >
//         Continue with Google
//       </button>
//     </div>
//   );
// };

// export default GoogleLoginPage;

// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import logo from "../../../public/kloudlogo.webp";

// const GoogleLoginPage = () => {
//   const navigate = useNavigate();

//   // Check if user is coming back from Google login
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const token = params.get("jwtoken");
//     const firstName = params.get("firstName");
//     const email = params.get("email");

//     if (token) {
//       localStorage.setItem("token", token);
//       Swal.fire("Success", `Logged in as ${firstName} (${email})`, "success");
//       navigate("/home");
//       console.log(token)
      
//     }
//   }, [navigate]);

//   const handleGoogleLogin = async () => {
//     // Just open the login URL directly
//     window.location.href = "http://localhost:10001/v1/auth/google";
//   };

//   return (
//     <div style={{ textAlign: "center", padding: "50px" }}>
//       <img src={logo} alt="Logo" width="200" />
//       <h2>Welcome! Please sign in</h2>
//       <button
//         onClick={handleGoogleLogin}
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#4285F4",
//           color: "white",
//           border: "none",
//           borderRadius: "5px",
//           fontSize: "16px",
//           cursor: "pointer",
//           marginTop: "20px",
//         }}
//       >
//         Continue with Google
//       </button>
//     </div>
//   );
// };

// export default GoogleLoginPage;


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../../public/kloudlogo.webp";

const GoogleLoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("jwtoken");
    const firstName = params.get("firstName");
    const lastName = params.get("lastName");
    const email = params.get("email");
    const accessToken = params.get("accessToken");

    if (token) {
      localStorage.setItem("token", token);
      Swal.fire("Success", `Logged in as ${firstName} ${lastName} (${email})`, "success");

      // Log all values in console
      console.log("JWT Token:", token);
      console.log("Access Token:", accessToken);
      console.log("First Name:", firstName);
      console.log("Last Name:", lastName);
      console.log("Email:", email);

      navigate("/home");
    }
  }, [navigate]);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:10001/v1/auth/google";
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <img src={logo} alt="Logo" width="200" />
      <h2>Welcome! Please sign in</h2>
      <button
        onClick={handleGoogleLogin}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Continue with Google
      </button>
    </div>
  );
};

export default GoogleLoginPage;
