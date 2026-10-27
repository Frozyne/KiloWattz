import { Outlet } from "react-router";
import Sidebar from "@/components/admin/SideBar";

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