import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { token } = useAuthContext();
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
