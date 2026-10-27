import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/public/LoginPage";
import ResidentHome from "./pages/resident/ResidentHome";
import { LandingPage } from "./pages/public/LandingPage";

// 1. Temporary Placeholder Components 
// (Your UI team will eventually move these into their own separate files)
const AdminCommandCenter = () => <h1>Admin: Command Center</h1>;


// 2. The Router Setup
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Zone 1: Public Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Zone 2: Admin Pages */}
        <Route path="/admin/dashboard" element={<AdminCommandCenter />} />
        
        {/* Zone 3: Resident Pages */}
        <Route path="/resident/dashboard" element={<ResidentHome />} />
      </Routes>
    </BrowserRouter>
  );
}