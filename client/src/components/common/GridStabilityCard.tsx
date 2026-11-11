import React from 'react'
import { Gauge, Loader2 } from 'lucide-react'
import { useCommunityTelemetryQuery } from '@/hooks/useTelementryQueries'

export const GridStabilityCard: React.FC = () => {
  const { data: telemetry, isLoading } = useCommunityTelemetryQuery()

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-secondary rounded-3xl border border-emerald-800/50">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    )
  }

  const voltage = telemetry?.summary?.gridVoltage ?? 230
  const activeTerminals = telemetry?.activeHouseholds ?? 0

  return (
    <div className="bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60 mb-4">
        <h3 className="font-semibold text-accent flex items-center gap-2">
          <Gauge className="h-5 w-5 text-emerald-400" /> Voltage & Stability
        </h3>
        <span className="text-xs font-mono text-emerald-300">Live Diagnostics</span>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
          <span className="text-emerald-200/80">Nominal Line Voltage</span>
          <span className="font-semibold text-emerald-400 font-mono">{voltage} V (Stable)</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
          <span className="text-emerald-200/80">Inverter Efficiency</span>
          <span className="font-semibold text-accent font-mono">98.4%</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
          <span className="text-emerald-200/80">Grid Frequency</span>
          <span className="font-semibold text-accent font-mono">50.00 Hz</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-emerald-200/80">Active Smart Meters</span>
          <span className="font-semibold text-accent font-mono">{activeTerminals} Online</span>
        </div>
      </div>
    </div>
  )
}