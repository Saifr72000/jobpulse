import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context";
import { Loader } from "../Loader/Loader";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
