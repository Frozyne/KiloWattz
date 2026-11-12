import React from 'react'
import { CloudSun } from 'lucide-react'
import { useLatestEnvironmentQuery } from '@/hooks/useGridMonitoringQueries'

export const EnvironmentalYieldCard: React.FC = () => {
  const { data: environment } = useLatestEnvironmentQuery()

  const irradiance = environment?.solarIrradiance ?? 800
  const cloudCover = environment?.cloudCoverPercent ?? 20
  const tempC = environment?.temperatureC ?? 31.5

  // Thermal loss estimation: ~0.4% efficiency drop per °C above STC standard 25°C
  const tempDegradation = tempC > 25 ? Math.round((tempC - 25) * 0.4 * 10) / 10 : 0

  return (
    <div className="bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60 mb-4">
        <h3 className="font-semibold text-accent flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-amber-400" /> Environmental Yield
        </h3>
        <span className="text-xs font-mono text-emerald-300">Live Telemetry</span>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
          <span className="text-emerald-200/80">Solar Irradiance</span>
          <span className="font-semibold text-accent font-mono">{irradiance} W/m²</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
          <span className="text-emerald-200/80">Cloud Cover</span>
          <span className="font-semibold text-accent font-mono">{cloudCover}%</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-emerald-900/40">
          <span className="text-emerald-200/80">Ambient Temperature</span>
          <span className="font-semibold text-accent font-mono">{tempC} °C</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-emerald-200/80">Thermal Degradation</span>
          <span className="font-semibold text-amber-300 font-mono">-{tempDegradation}% Efficiency</span>
        </div>
      </div>
    </div>
  )
}