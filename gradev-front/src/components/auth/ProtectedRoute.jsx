import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Wait until authentication status is checked
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0D10]">
        <div className="size-8 animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-400" />
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow authenticated users
  return <Outlet />;
}

export default ProtectedRoute;
