import React from 'react'
import { Sun, Activity, BatteryCharging, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export const TelemetryPreviewCard: React.FC = () => {
  return (
    <Card className="mt-16 max-w-5xl mx-auto rounded-2xl border-zinc-800 bg-zinc-900/60 p-2 sm:p-4 backdrop-blur-xl shadow-2xl relative text-left">
      <CardHeader className="p-4 flex flex-row items-center justify-between pb-4 border-b border-zinc-800/80 space-y-0">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
            Live Estate Telemetry Snapshot
          </span>
        </div>
        <span className="text-xs text-zinc-500 font-mono">Central Array: Operational</span>
      </CardHeader>

      <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
            <span>Solar Output</span>
            <Sun className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            345.5 <span className="text-sm font-normal text-zinc-400">kW</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Peak Irradiance Active</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
            <span>Estate Power Draw</span>
            <Activity className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            218.2 <span className="text-sm font-normal text-zinc-400">kW</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">100 Connected Homes</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
            <span>Battery Reserve</span>
            <BatteryCharging className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            88.5 <span className="text-sm font-normal text-zinc-400">%</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">1,100 kWh Reserve</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
          <div className="flex items-center justify-between text-zinc-400 text-xs font-medium mb-2">
            <span>Grid Savings</span>
            <TrendingUp className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            ₦2,610 <span className="text-xs font-normal text-zinc-400">/day/home</span>
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">vs ₦225/kWh DisCo Rate</div>
        </div>
      </CardContent>
    </Card>
  )
}