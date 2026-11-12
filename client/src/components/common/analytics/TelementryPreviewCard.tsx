import React from 'react'
import { Sun, Activity, BatteryCharging, TrendingUp } from 'lucide-react'
import { useCommunityTelemetryQuery } from '@/hooks/useTelementryQueries'

export const TelemetryPreviewCard: React.FC = () => {
  const { data: telemetry } = useCommunityTelemetryQuery()

  const solarKW = telemetry?.summary?.solarGeneratedKW ?? 345.5
  const consumedKW = telemetry?.summary?.powerConsumedKW ?? 218.2
  const activeCount = telemetry?.activeHouseholds ?? 100

  return (
    <div className="mt-8 max-w-5xl mx-auto rounded-3xl border border-emerald-800/50 bg-secondary p-4 sm:p-6 shadow-xl relative text-left space-y-4">
      <div className="flex flex-row items-center justify-between pb-4 border-b border-emerald-800/60">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
            Live Microgrid Telemetry Snapshot
          </span>
        </div>
        <span className="text-xs text-emerald-300 font-mono">Central Farm: Operational</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Solar Output */}
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium mb-2">
            <span>Solar Output</span>
            <Sun className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-accent font-mono">
            {solarKW} <span className="text-sm font-normal text-emerald-200">kW</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Peak Generation Active</div>
        </div>

        {/* Estate Power Draw */}
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium mb-2">
            <span>Estate Power Draw</span>
            <Activity className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-accent font-mono">
            {consumedKW} <span className="text-sm font-normal text-emerald-200">kW</span>
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">{activeCount} Connected Meters</div>
        </div>

        {/* Battery Reserve */}
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/60">
          <div className="flex items-center justify-between text-emerald-300 text-xs font-medium mb-2">
            <span>Battery Reserve</span>
            <BatteryCharging className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-accent font-mono">
            88.5 <span className="text-sm font-normal text-emerald-200">%</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">1,100 kWh Reserve</div>
        </div>
      </div>
    </div>
  )
}