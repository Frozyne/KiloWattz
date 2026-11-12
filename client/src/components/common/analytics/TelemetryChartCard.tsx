import React from 'react'
import { Loader2 } from 'lucide-react'
import { useCommunityTelemetryQuery, useHouseholdTelemetryQuery } from '@/hooks/useTelementryQueries'
import { useHouseholdDetailQuery } from '@/hooks/useHouseholdQueries'

interface TelemetryChartCardProps {
  scope: 'community' | 'household'
  selectedHouseholdId?: string
}

export const TelemetryChartCard: React.FC<TelemetryChartCardProps> = ({
  scope,
  selectedHouseholdId,
}) => {
  const { data: communityTelemetry, isLoading: isCommunityLoading } = useCommunityTelemetryQuery()
  const { data: householdLogs, isLoading: isHouseholdLoading } = useHouseholdTelemetryQuery(
    scope === 'household' ? selectedHouseholdId : undefined
  )
  const { data: household } = useHouseholdDetailQuery(selectedHouseholdId)

  const isLoading = scope === 'community' ? isCommunityLoading : isHouseholdLoading

  if (isLoading) {
    return (
      <div className="flex h-72 items-center justify-center bg-secondary rounded-3xl border border-emerald-800/50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  const hourlyData = communityTelemetry?.hourly || []

  const displayLogs = scope === 'community'
    ? hourlyData.map((d: any) => ({
        label: d.hour || `${new Date(d.timestamp).getHours()}:00`,
        solar: d.solarGeneratedKW ?? 0,
        consumed: d.powerConsumedKW ?? 0,
      }))
    : (householdLogs || []).slice(0, 24).reverse().map((log: any) => ({
        label: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        solar: log.solarGeneratedKW ?? 0,
        consumed: log.powerConsumedKW ?? 0,
      }))

  const maxVal = Math.max(
    1,
    ...displayLogs.map((d: any) => Math.max(d.solar, d.consumed))
  )

  return (
    <div className="bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-emerald-800/60">
        <div>
          <h3 className="text-lg font-bold text-accent">
            {scope === 'community' ? '24-Hour Microgrid Generation & Load' : 'Meter Readings'}
          </h3>
          <p className="text-xs text-emerald-300/80">
            {scope === 'community'
              ? 'Hourly telemetry across central arrays and active meters'
              : `Telemetry log readings for household: ${household?.meterSerialNumber}`}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
            <span>Solar (kW)</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300">
            <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
            <span>Load (kW)</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 px-2 overflow-x-auto">
        {displayLogs.map((item: any, idx: number) => {
          const solarHeight = (item.solar / maxVal) * 100
          const consumedHeight = (item.consumed / maxVal) * 100

          return (
            <div key={idx} className="flex-1 min-w-[20px] flex flex-col items-center gap-1 h-full justify-end group">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -translate-y-16 bg-emerald-950 border border-emerald-700 p-1.5 rounded text-[10px] text-accent z-20 pointer-events-none whitespace-nowrap shadow-xl">
                <div>{item.label}</div>
                <div className="text-amber-300">Solar: {item.solar} kW</div>
                <div className="text-emerald-400">Draw: {item.consumed} kW</div>
              </div>

              <div className="w-full flex items-end justify-center gap-0.5 h-full">
                <div
                  style={{ height: `${Math.max(4, solarHeight)}%` }}
                  className="w-1/2 bg-amber-400/90 hover:bg-amber-300 rounded-t transition-all"
                />
                <div
                  style={{ height: `${Math.max(4, consumedHeight)}%` }}
                  className="w-1/2 bg-emerald-500/90 hover:bg-emerald-400 rounded-t transition-all"
                />
              </div>

              <span className="text-[9px] font-mono text-emerald-300/70 truncate w-full text-center">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}