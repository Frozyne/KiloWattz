import { Routes, Route } from "react-router";

import Dashboard from "./pages/admin/DashboardLayout";
import LoginPage from "./pages/public/LoginPage";
import { LandingPage } from "./pages/public/LandingPage";
import AlertPage from "./pages/admin/AlertsPage";
import Devices from "./pages/admin/DevicesPages";
import { OverviewPage } from "./pages/admin/OverviewPage";
import SolarSites from "./pages/admin/SolarSites";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import ProfilePage from './pages/admin/ProfilePage'

import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Authenticated Dashboard Branch */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Accessible to all authenticated roles */}
          <Route path="overview" element={<OverviewPage />} />
          <Route path="alerts" element={<AlertPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* Restricted to Admin only within the same layout */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="devices" element={<Devices />} />
            <Route path="users" element={<SolarSites />} />
            <Route path="reports" />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}