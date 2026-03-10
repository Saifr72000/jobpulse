import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout";

// Auth pages
import LoginPage from "./pages/auth/Login";

// Client pages
import Dashboard from "./pages/client/Dashboard";
import MyOrders from "./pages/client/Orders/MyOrders";
import NewOrder from "./pages/client/Orders/NewOrder";
import OrderDetail from "./pages/client/Orders/OrderDetail";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes wrapped in MainLayout */}
          <Route
            element={
              <ProtectedRoute />
            }
          >
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/new" element={<NewOrder />} />
              <Route path="/orders/:orderId" element={<OrderDetail />} />
              <Route index element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
