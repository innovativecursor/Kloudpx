import logo from "../../../public/kloudlogo.webp";
import { getAxiosCall } from "../../Axios/UniversalAxiosCalls";
// import { useNavigate } from "react-router-dom";

const Login = () => {
  // const navigate = useNavigate();
  const handleGoogleLogin = async () => {
    const result = await getAxiosCall("/oauth/login");
    console.log("result", result);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-homexbg bg-opacity-30">
      <div className="bg-white py-6 border rounded-xl shadow-2xl w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-20" />
        </div>
        <h2 className="text-2xl font-semibold mb-4">kloud</h2>
        <div className="mx-6">
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3  py-2 border border-gray-300 font-semibold rounded-md w-full text-lg hover:bg-gray-100 transition"
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

export default Login;
