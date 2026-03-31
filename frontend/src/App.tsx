import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import { MainLayout } from "./layouts/MainLayout";

// Auth pages
import LoginPage from "./pages/auth/Login";
import SetPasswordPage from "./pages/auth/SetPassword/SetPassword";

// Client pages
import Dashboard from "./pages/client/Dashboard";
import MyOrders from "./pages/client/Campaigns/MyCampaigns";
import NewCampaign from "./pages/client/NewCampaign/NewCampaign";
/* import OrderDetail from "./pages/client/Orders/OrderDetail"; */
import CampaignDetail from "./pages/client/Campaigns/CampaignDetail";
import SettingsPage from "./pages/client/Settings/Settings";
import MediaLibrary from "./pages/client/MediaLibrary/MediaLibrary";
import MediaCategoryPage from "./pages/client/MediaLibrary/MediaCategoryPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/set-password" element={<SetPasswordPage />} />

          {/* Protected routes wrapped in MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* Campaigns listing — accessible at both /campaigns and /orders */}
              <Route path="/campaigns" element={<MyOrders />} />
              {/* <Route path="/orders" element={<MyOrders />} /> */}
              <Route path="/orders/new" element={<NewCampaign />} />
              {/* <Route path="/orders/:orderId" element={<OrderDetail />} /> */}
              <Route path="/campaigns/:orderId" element={<CampaignDetail />} />
              <Route path="/media-library" element={<MediaLibrary />} />
              <Route
                path="/media-library/:folderId"
                element={<MediaCategoryPage />}
              />
              <Route path="/settings" element={<SettingsPage />} />
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
