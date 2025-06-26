import { Routes, Route } from "react-router-dom";
import ROUTES from "./routePaths";
import Login from "../pages/Login";
import Home from "../pages/Home";
import FindPrescription from "../pages/prescription/FindPrescription";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PrescriptionDetails from "../pages/prescription/PrescriptionDetails";

export default function RoutePage() {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.FINDPRESCRIPTION} element={<FindPrescription />} />
        <Route
          path={ROUTES.PRESCRIPTION_DETAILS}
          element={<PrescriptionDetails />}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
