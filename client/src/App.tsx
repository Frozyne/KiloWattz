import { BrowserRouter, Routes, Route } from "react-router-dom"; // or "react-router", see below
import Dashboard from "./DashBoard/page";
import Devices from "./DashBoard/Devices/page";
import Analytics from "./components/ui/Analytics";
import AlertList from "./components/ui/AlertList";
import Solar from "./DashBoard/Solar-sites/page";
import NavBar from "./components/ui/NavBar";
import WeatherCard from "./components/ui/WeatherCard";
import AdminLiveStat from "./components/ui/AdminLiveStatsRow";

// Placeholders from the leader's version (the UI team replaces these later)
const LandingPage = () => <h1>KiloWatz Community Solar</h1>;
const LoginPage = () => <h1>Login to your Dashboard</h1>;
const ResidentHome = () => <h1>Resident: My Home Overview</h1>;

// Your overview page
function Overview() {
  return (
    <div className="flex flex-col gap-3">
      <NavBar />
      <AdminLiveStat />
      <Solar />
      <Analytics />
      <Devices />
      <AlertList />
      <WeatherCard />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Zone 1: Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Zone 2: Admin Pages (your dashboard lives here) */}
        <Route path="/admin" element={<Dashboard />}>
          <Route path="dashboard" element={<Overview />} />
          <Route path="live-stats" element={<AdminLiveStat />} />
          <Route path="devices" element={<Devices />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alertlist" element={<AlertList />} />
          <Route path="solar" element={<Solar />} />
          <Route path="weather" element={<WeatherCard />} />
        </Route>

        {/* Zone 3: Resident Pages */}
        <Route path="/resident/dashboard" element={<ResidentHome />} />
      </Routes>
    </BrowserRouter>
  );
}