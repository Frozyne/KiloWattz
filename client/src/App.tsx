import { BrowserRouter, Routes, Route } from "react-router";

import Dashboard from "./pages/admin/DashboardLayout";
import LoginPage from "./pages/public/LoginPage";
import { LandingPage } from "./pages/public/LandingPage";
import AlertPage from "./pages/admin/AlertsPage";
import Devices from "./pages/admin/DevicesPages";
import { OverviewPage } from "./pages/admin/OverviewPage";
import SolarSites from "./pages/admin/SolarSites";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import Profile from './components/common/ProfilePage'

import { ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  
  return (
    <BrowserRouter>
    
      <Routes>
        {/* Public Routes: No protection required */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* These routes are protected and require authentication (All Roles)*/}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>

            <Route path="overview" element={<OverviewPage />} />
            <Route path="alerts" element={<AlertPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="profile" element={<Profile />} />
            
          </Route>
        </Route>

        {/* These routes are protected and require authentication (Admin Only)*/}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/dashboard" element={<Dashboard />}>

            <Route path="devices" element={<Devices />} />
            <Route path="users" element={<SolarSites />} />
            <Route path="reports" />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}