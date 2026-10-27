import { BrowserRouter, Routes, Route } from "react-router"; // or "react-router", see below

import Dashboard from "./pages/admin/DashboardLayout";
import LoginPage from "./pages/public/LoginPage";
import ResidentHome from "./pages/resident/ResidentHome";
import { LandingPage } from "./pages/public/LandingPage";
import AlertPage from "./pages/admin/AlertsPage";
import Devices from "./pages/admin/DevicesPages";
import { OverviewPage } from "./pages/admin/OverviewPage";
import SolarSites from "./pages/admin/SolarSites";
import AnalyticsPage from "./pages/admin/AnalyticsPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<Dashboard />}>
          <Route path="dashboard" element={<OverviewPage />} />
          <Route path="devices" element={<Devices />} />
          <Route path="sites" element={<SolarSites />} />
          <Route path="alertlist" element={<AlertPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        <Route path="/resident/dashboard" element={<ResidentHome />} />
      </Routes>
    </BrowserRouter>
  );
}