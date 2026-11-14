import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicRoute from "../components/auth/PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Classes from "../pages/Classes/Classes";
import Dashboard from "../pages/Dashboard/Dashboard";
import OverallGrading from "../pages/OverallGrading/OverallGrading";
import Reports from "../pages/Reports/Reports";
import SessionGrading from "../pages/SessionGrading/SessionGrading";
import Settings from "../pages/Settings/Settings";
import Students from "../pages/Students/Students";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-emerald-400">404</h1>

      <p className="mt-4 text-gray-400">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />

            <Route path="/students" element={<Students />} />

            <Route path="/classes" element={<Classes />} />

            <Route path="/session-grading" element={<SessionGrading />} />

            <Route path="/overall-grading" element={<OverallGrading />} />

            <Route path="/reports" element={<Reports />} />

            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
