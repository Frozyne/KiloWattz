import { useState, useEffect } from 'react'
import { useLatestEnvironmentQuery } from '@/hooks/useGridMonitoringQueries'
import { getWeatherCondition } from '@/lib/weather'
import UserStats from './UserStats'
import { Sun, Clock } from 'lucide-react'

const WeatherStats = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { data: environment } = useLatestEnvironmentQuery()

  const weatherCondition = getWeatherCondition(
    environment?.solarIrradiance,
    environment?.cloudCoverPercent
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="bg-secondary border border-emerald-800/50 rounded-3xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
      {/* Overview Details */}
      <div className="space-y-2">
        {/* Date & Weather Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-700/40 bg-emerald-950/60 px-3.5 py-1 text-xs font-medium text-emerald-100">
          <Clock className="size-3.5 text-emerald-300" />
          <span className="font-mono">{currentDate.toLocaleTimeString()}</span>
          <span className="text-emerald-600">•</span>
          <span>{currentDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          <span className="text-emerald-600">•</span>
          <span className="flex items-center gap-1 text-amber-300 font-semibold">
            <Sun className="size-3.5" />
            {weatherCondition.condition}
          </span>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-accent">
            Solar Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
            Live generation and performance across your entire portfolio.
          </p>
        </div>
      </div>

      {/* User Quick Menu Widget */}
      <div className="flex items-center justify-start md:justify-end shrink-0">
        <UserStats />
      </div>
    </div>
  )
}

export default WeatherStats