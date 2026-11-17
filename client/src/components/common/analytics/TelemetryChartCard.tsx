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
  const { data: household } = useHouseholdDetailQuery(selectedHouseholdId || '')

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
    ? hourlyData.map((d: any) => {
        const hourNum = typeof d._id === 'number' ? d._id : Number(d.hour)
        const label = !Number.isNaN(hourNum)
          ? `${String(hourNum).padStart(2, '0')}:00`
          : '--:--'

        return {
          label,
          primary: Math.round((d.solarGeneratedKW ?? 0) * 100) / 100,
          secondary: Math.round((d.powerConsumedKW ?? 0) * 100) / 100,
          battery: Math.round((d.batteryLevelPercent ?? 0) * 100) / 100,
        }
      })
    : (householdLogs || []).slice(0, 24).reverse().map((log: any) => ({
        label: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        primary: Math.round((log.powerConsumedKW ?? 0) * 100) / 100,
        secondary: Math.round((log.powerConsumedKWh ?? 0) * 1000) / 1000,
        battery: Math.round((log.batteryLevelPercent ?? 0) * 100) / 100,
      }))

  const primaryLabel = scope === 'community' ? 'Solar (kW)' : 'Power Draw (kW)'
  const secondaryLabel = scope === 'community' ? 'Avg Load (kW)' : 'Interval Usage (kWh)'
  const batteryLabel = 'Battery (%)'
  const primaryUnit = 'kW'
  const secondaryUnit = scope === 'community' ? 'kW' : 'kWh'
  const batteryUnit = '%'

  const maxVal = Math.max(
    1,
    ...displayLogs.map((d: any) => Math.max(d.primary, d.secondary, d.battery))
  )

  return (
    <div className="bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-emerald-800/60">
        <div>
          <h3 className="text-lg font-bold text-accent">
            {scope === 'community' ? '24-Hour Microgrid Generation & Load' : 'Household Meter Telemetry'}
          </h3>
          <p className="text-xs text-emerald-300/80">
            {scope === 'community'
              ? 'Hourly solar output vs. average household demand'
              : `Recent readings for meter: ${household?.meterSerialNumber || 'N/A'}`}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
            <span>{primaryLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300">
            <span className="h-3 w-3 rounded-full bg-emerald-500 inline-block" />
            <span>{secondaryLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-violet-300">
            <span className="h-3 w-3 rounded-full bg-violet-500 inline-block" />
            <span>{batteryLabel}</span>
          </div>
        </div>
      </div>

      {displayLogs.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-xs text-emerald-300/60 italic">
          No telemetry logs recorded for this period yet.
        </div>
      ) : (
        <div className="h-64 flex items-end gap-1.5 sm:gap-2 pt-6 pb-2 px-2 overflow-x-auto">
          {displayLogs.map((item: any, idx: number) => {
            const primaryHeight = (item.primary / maxVal) * 100
            const secondaryHeight = (item.secondary / maxVal) * 100
            const batteryHeight = (item.battery / maxVal) * 100

            return (
              <div key={idx} className="relative flex-1 min-w-6 flex flex-col items-center gap-1 h-full justify-end group">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 bg-emerald-950 border border-emerald-700 p-1.5 rounded text-[10px] text-accent z-20 pointer-events-none whitespace-nowrap shadow-xl">
                  <div className="font-semibold">{item.label}</div>
                  <div className="text-amber-300">{primaryLabel}: {item.primary} {primaryUnit}</div>
                  <div className="text-emerald-400">{secondaryLabel}: {item.secondary} {secondaryUnit}</div>
                  <div className="text-emerald-400">{batteryLabel}: {item.battery} {batteryUnit}</div>
                </div>

                <div className="w-full flex items-end justify-center gap-0.5 h-full">
                  <div
                    style={{ height: `${Math.max(4, primaryHeight)}%` }}
                    className="w-1/2 bg-amber-400/90 hover:bg-amber-300 rounded-t transition-all"
                  />
                  <div
                    style={{ height: `${Math.max(4, secondaryHeight)}%` }}
                    className="w-1/2 bg-emerald-500/90 hover:bg-emerald-400 rounded-t transition-all"
                  />
                  <div
                    style={{ height: `${Math.max(4, batteryHeight)}%` }}
                    className="w-1/2 bg-violet-500/90 hover:bg-violet-400 rounded-t transition-all"
                  />
                </div>

                <span className="text-[9px] font-mono text-emerald-300/70 truncate w-full text-center">
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}