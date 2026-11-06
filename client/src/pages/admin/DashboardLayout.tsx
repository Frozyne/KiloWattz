import { Outlet } from "react-router";
import Sidebar from "@/components/admin/SideBar";
import { useMicrogridSocket } from "../../hooks/useMicroGridSocket";
import { toast, Toaster } from "@/components/ui/toast";

export default function DashboardLayout() {
  const { isConnected } = useMicrogridSocket({
    onQuotaBreached: (data) => {
      toast.add({
        title: `Quota Breach: ${data.householdName}`,
        description: `Consumed ${data.consumedKWh} / ${data.dailyQuotaKWh} kWh. Connection has been suspended.`,
        type: 'error',
        priority: 'low',
      })
    }
  })

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}