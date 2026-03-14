import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout";

// Auth pages
import LoginPage from "./pages/auth/Login";

// Client pages
import Dashboard from "./pages/client/Dashboard";
import MyOrders from "./pages/client/Campaigns/MyCampaigns";
import NewCampaign from "./pages/client/NewCampaign/NewCampaign";
import OrderDetail from "./pages/client/Orders/OrderDetail";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes wrapped in MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Campaigns listing — accessible at both /campaigns and /orders */}
              <Route path="/campaigns" element={<MyOrders />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/new" element={<NewCampaign />} />
              <Route path="/orders/:orderId" element={<OrderDetail />} />
              <Route path="/campaigns/:orderId" element={<OrderDetail />} />
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
