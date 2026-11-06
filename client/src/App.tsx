import { BrowserRouter, Routes, Route } from "react-router";

import Dashboard from "./pages/admin/DashboardLayout";
import AlertPage from "./pages/admin/AlertsPage";
import Devices from "./pages/admin/DevicesPages";
import { OverviewPage } from "./pages/admin/OverviewPage";
import SolarSites from "./pages/admin/SolarSites";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import Profile from "./components/common/ProfilePage";

import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  
  return (
    <BrowserRouter>
    <Routes>
    <Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />}>
    <Route path="overview" element={<OverviewPage />} />
    <Route path="alerts" element={<AlertPage />} />
    <Route path="analytics" element={<AnalyticsPage />} />
    <Route path="profile" element={<Profile />} />

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