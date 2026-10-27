import { Outlet } from "react-router-dom";
import Sidebar from "@/components/SideBar";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}