import React from 'react'
import { Gauge, Loader2 } from 'lucide-react'
import { useCommunityTelemetryQuery, useHouseholdTelemetryQuery } from '@/hooks/useTelementryQueries'
import { useHouseholdDetailQuery } from '@/hooks/useHouseholdQueries'
import { useInfrastructureStatsQuery } from '@/hooks/useInfrastructureQueries'

interface GridStabilityCardProps {
  scope: 'community' | 'household'
  selectedHouseholdId?: string
}

export const GridStabilityCard: React.FC<GridStabilityCardProps> = ({
  scope,
  selectedHouseholdId,
}) => {
  const { data: telemetry, isLoading: isCommunityLoading } = useCommunityTelemetryQuery()
  const { data: infrastructure } = useInfrastructureStatsQuery()
  const { data: household } = useHouseholdDetailQuery(
    scope === 'household' ? (selectedHouseholdId || '') : ''
  )
  const { data: householdLogs, isLoading: isHouseholdLoading } = useHouseholdTelemetryQuery(
    scope === 'household' ? selectedHouseholdId : undefined
  )

  const isLoading = scope === 'community' ? isCommunityLoading : isHouseholdLoading

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-secondary rounded-3xl border border-emerald-800/50">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    )
  }

  const communityVoltage = telemetry?.summary?.liveGridVoltage ?? telemetry?.summary?.gridVoltage ?? 230
  const homeVoltage = householdLogs?.[0]?.gridVoltage ?? 230
  const displayVoltage = scope === 'community' ? communityVoltage : homeVoltage
  const isVoltageHealthy = displayVoltage >= 215 && displayVoltage <= 245

  const terminals = household?.meter
    ? [
        household.meter.terminal1,
        household.meter.terminal2,
        household.meter.terminal3,
        household.meter.terminal4,
        household.meter.terminal5,
        household.meter.terminal6,
      ].filter(Boolean)
    : []
  const activeCircuits = terminals.filter((t: any) => t?.connectionStatus === 'On').length

  return (
    <div className="bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60 mb-4">
        <h3 className="font-semibold text-accent flex items-center gap-2">
          <Gauge className="h-5 w-5 text-emerald-400" />
          {scope === 'community' ? 'Grid Voltage & Stability' : 'Meter Diagnostics'}
        </h3>
        <span className="text-xs font-mono text-emerald-300">Live</span>
      </div>

      {scope === 'community' ? (
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
            <span className="text-emerald-200/80">Live Line Voltage</span>
            <span className={`font-semibold font-mono ${isVoltageHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
              {communityVoltage} V ({isVoltageHealthy ? 'Stable' : 'Fluctuating'})
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
            <span className="text-emerald-200/80">Inverter Efficiency</span>
            <span className="font-semibold text-accent font-mono">
              {(infrastructure?.summary?.inverters?.efficiency || 0) / (infrastructure?.summary?.inverters?.count || 0) || 98.4}%
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
            <span className="text-emerald-200/80">Grid Frequency</span>
            <span className="font-semibold text-accent font-mono">50.00 Hz</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-emerald-200/80">Active Smart Meters</span>
            <span className="font-semibold text-accent font-mono">
              {telemetry?.activeHouseholds ?? 0} Online
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
            <span className="text-emerald-200/80">Terminal Line Voltage</span>
            <span className={`font-semibold font-mono ${isVoltageHealthy ? 'text-emerald-400' : 'text-amber-400'}`}>
              {homeVoltage} V ({isVoltageHealthy ? 'Normal' : 'Check Line'})
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
            <span className="text-emerald-200/80">Active Circuits</span>
            <span className="font-semibold text-accent font-mono">
              {activeCircuits} of {terminals.length || 6} On
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
            <span className="text-emerald-200/80">Meter Serial</span>
            <span className="font-semibold text-accent font-mono">
              {household?.meterSerialNumber || 'N/A'}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-emerald-200/80">Connection Status</span>
            <span className={`font-semibold font-mono ${
              household?.connectionStatus === 'Active' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {household?.connectionStatus || 'Disconnected'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}