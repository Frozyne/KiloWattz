import { useEffect } from "react"
import { Outlet } from "react-router"
import Sidebar from "@/components/admin/SideBar"
import { useSocket } from "@/context/socketContext"
import { toast, Toaster } from "@/components/ui/toast"

export default function DashboardLayout() {
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    // Real-time toast notification handler for Quota Breaches
    const handleQuotaBreach = (data: {
      householdName?: string
      consumedKWh?: number
      dailyQuotaKWh?: number
    }) => {
      toast.add({
        title: `Quota Breach: ${data.householdName || 'Household'}`,
        description: `Consumed ${data.consumedKWh || 0} / ${data.dailyQuotaKWh || 0} kWh. Connection has been suspended.`,
        type: 'error',
        priority: 'low',
      })
    }

    socket.on('household:quota_breached', handleQuotaBreach)

    return () => {
      socket.off('household:quota_breached', handleQuotaBreach)
    }
  }, [socket])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-w-0 p-4 bg-gray-100 min-h-screen">
        {/* Connection health indicator optional check: isConnected */}
        <Outlet />
      </div>
      <Toaster />
    </div>
  )
}