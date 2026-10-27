import { BrowserRouter, Routes, Route } from "react-router"; // or "react-router", see below
import Dashboard from "./DashBoard/page";
import Devices from "./DashBoard/Devices/page";
import Analytics from "./components/ui/Analytics";
import AlertList from "./components/ui/AlertList";
import Solar from "./DashBoard/Solar-sites/page";
import NavBar from "./components/ui/NavBar";
import WeatherCard from "./components/ui/WeatherCard";
import AdminLiveStat from "./components/ui/AdminLiveStatsRow";
import LoginPage from "./pages/public/LoginPage";
import ResidentHome from "./pages/resident/ResidentHome";
import { LandingPage } from "./pages/public/LandingPage";


const AdminCommandCenter = () => <h1>Admin: Command Center</h1>;

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/admin" element={<Dashboard />}>
          <Route path="dashboard" element={<Overview />} />
          <Route path="live-stats" element={<AdminLiveStat />} />
          <Route path="devices" element={<Devices />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="alertlist" element={<AlertList />} />
          <Route path="solar" element={<Solar />} />
          <Route path="weather" element={<WeatherCard />} />
        </Route>

        <Route path="/resident/dashboard" element={<ResidentHome />} />
      </Routes>
    </BrowserRouter>
  );
}