import { BrowserRouter, Routes, Route } from "react-router-dom";
import ROUTES from "./routePaths";
import Login from "../pages/Login";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";

export default function RoutePage() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
