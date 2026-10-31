import { Outlet } from "react-router";
import Sidebar from "./SideBar";

export default function AdminLayout() {
  return (
    <div className="flex h-screen gap-4 p-4">
      <Sidebar />
      <main className="min-h-0 flex-1 overflow-y-auto rounded-xl bg-zinc-900/80 p-4">
        <Outlet />
      </main>
    </div>
  );
}