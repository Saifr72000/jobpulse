import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useAuth } from "../context";
import "./MainLayout.scss";

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const getActivePage = () => {
    const path = location.pathname;
    if (path === "/" || path === "/dashboard") return "dashboard";
    if (path === "/orders/new") return "new-order";
    if (path.startsWith("/orders")) return "my-orders";
    return path.slice(1);
  };

  const handleNavigate = (page: string) => {
    if (page === "logout") {
      logout();
      navigate("/login");
      return;
    }

    const routes: Record<string, string> = {
      dashboard: "/dashboard",
      "new-order": "/orders/new",
      "my-orders": "/orders",
      settings: "/settings",
      users: "/users",
      analytics: "/analytics",
      "media-library": "/media-library",
    };

    navigate(routes[page] || `/${page}`);
  };

  return (
    <div className="main-layout">
      <Sidebar activePage={getActivePage()} onNavigate={handleNavigate} />
      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  );
}
