import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/admin/DashboardLayout";
import AlertPage from "./pages/admin/AlertsPage";
import Devices from "./pages/admin/DevicesPages";
import { OverviewPage } from "./pages/admin/OverviewPage";
import SolarSites from "./pages/admin/SolarSites";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import Profile from "./components/common/ProfilePage";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/public/LoginPage";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  
  return (
    <BrowserRouter>
   <Routes>
  {/* Public */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />

  {/* Protected (all roles) */}
  <Route element={<ProtectedRoute />}>
    <Route path="/admin" element={<Dashboard />}>
      <Route path="dashboard" element={<OverviewPage />} />
      <Route path="analytics" element={<AnalyticsPage />} />
      <Route path="alertlist" element={<AlertPage />} />
      <Route path="profile" element={<Profile />} />

      {/* Admin only */}
      <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
        <Route path="devices" element={<Devices />} />
        <Route path="sites" element={<SolarSites />} />
      </Route>
    </Route>
  </Route>
</Routes>
</BrowserRouter>
  );
}