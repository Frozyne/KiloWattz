import React from 'react'
import { Sun, Activity, BatteryCharging, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react'
import { useCommunityTelemetryQuery } from '@/hooks/useTelementryQueries'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { useInfrastructureStatsQuery } from '@/hooks/useInfrastructureQueries'
import { useAllHouseholdsQuery } from '@/hooks/useHouseholdQueries'

interface AnalyticsKpiRowProps {
  scope: 'community' | 'household'
  selectedHouseholdId?: string
}

export const AnalyticsKpiRow: React.FC<AnalyticsKpiRowProps> = ({ scope, selectedHouseholdId }) => {
  const { data: user } = useCurrentUserQuery()
  const { data: communityTelemetry, isLoading } = useCommunityTelemetryQuery()
  const { data: infrastructure } = useInfrastructureStatsQuery()
  const { data: allHouseholds } = useAllHouseholdsQuery()

  // Match target household from selection or fallback to user's first household
  const householdList = user?.role === 'Admin' ? (allHouseholds || []) : (user?.households || [])
  const activeHousehold = householdList.find((hh) => hh._id === selectedHouseholdId) || householdList[0]
  const activeHouseholdsCount = communityTelemetry?.activeHouseholds || 1

  const totalSolarOutputKW = scope === 'community'
    ? (communityTelemetry?.summary?.solarGeneratedKW ?? 0)
    : Math.round(((communityTelemetry?.summary?.solarGeneratedKW ?? 0) / activeHouseholdsCount) * 100) / 100

  const totalConsumedKWh = scope === 'community'
    ? (communityTelemetry?.summary?.powerConsumedKW ?? 0)
    : (activeHousehold?.consumedKWh ?? 0)

  const currentPowerLoadKW = scope === 'community'
    ? (communityTelemetry?.summary?.powerConsumedKW ?? 0)
    : 0

  const dailyQuotaKWh = activeHousehold?.dailyKWHQuota ?? 20
  const quotaRemainingKWh = Math.max(0, dailyQuotaKWh - (activeHousehold?.consumedKWh ?? 0))
  const quotaHeadroomPercent = Math.min(100, Math.round((quotaRemainingKWh / dailyQuotaKWh) * 100))

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center bg-secondary rounded-3xl border border-emerald-800/50">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Solar Generation */}
      <div className="bg-secondary p-5 rounded-3xl border border-emerald-800/50 shadow-md">
        <div className="flex justify-between items-center text-xs font-medium text-emerald-300 mb-2">
          <span>{scope === 'community' ? 'Central Solar Farm' : 'Household Allocation'}</span>
          <Sun className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-accent font-mono">
          {totalSolarOutputKW} <span className="text-sm font-normal text-emerald-200">kW</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{scope === 'community' ? `${infrastructure?.summary?.solarArrays?.count ?? 9} Central Arrays Online` : `Grid Allocation: ${dailyQuotaKWh} kWh`}</span>
        </div>
      </div>

      {/* 2. Energy Consumed */}
      <div className="bg-secondary p-5 rounded-3xl border border-emerald-800/50 shadow-md">
        <div className="flex justify-between items-center text-xs font-medium text-emerald-300 mb-2">
          <span>{scope === 'community' ? 'Total Energy Usage' : 'Home Energy Usage'}</span>
          <Activity className="h-4 w-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold text-accent font-mono">
          {totalConsumedKWh} <span className="text-sm font-normal text-emerald-200">kWh</span>
        </div>
        <div className="text-xs text-emerald-200/80 mt-2">
          {scope === 'community' ? (
            <>Current Load: <strong className="text-accent font-mono">{currentPowerLoadKW} kW</strong></>
          ) : (
            <>Daily Quota: <strong className="text-accent font-mono">{dailyQuotaKWh} kWh</strong></>
          )}
        </div>
      </div>

      {/* 3. Quota Headroom */}
      <div className="bg-secondary p-5 rounded-3xl border border-emerald-800/50 shadow-md">
        <div className="flex justify-between items-center text-xs font-medium text-emerald-300 mb-2">
          <span>{scope === 'community' ? 'Grid Compliance' : 'Quota Monitor'}</span>
          <ShieldAlert className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-accent font-mono">
          {scope === 'community' 
            ? `${Math.floor(((communityTelemetry?.activeHouseholds ?? 0) / (allHouseholds?.length || 1)) * 100)}%` 
            : `${quotaHeadroomPercent}% Remaining`}
        </div>
        <div className="text-xs text-emerald-200/80 mt-2 font-medium">
          {scope === 'community' ? (
            <span>{communityTelemetry?.activeHouseholds} Households Connected</span>
          ) : activeHousehold?.connectionStatus === 'Suspended' ? (
            <span className="text-red-400 font-semibold">Meter Suspended</span>
          ) : (
            <span>{quotaRemainingKWh} kWh Remaining Today</span>
          )}
        </div>
      </div>

      {/* 4. Battery Reserve */}
      <div className="bg-secondary p-5 rounded-3xl border border-emerald-800/50 shadow-md">
        <div className="flex justify-between items-center text-xs font-medium text-emerald-300 mb-2">
          <span>Battery Storage</span>
          <BatteryCharging className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-bold text-accent font-mono">
          {communityTelemetry?.summary?.batteryLevelPercent ?? 0} <span className="text-sm font-normal text-emerald-200">%</span>
        </div>
        <div className="text-xs text-emerald-400 mt-2 font-medium">
          {infrastructure?.summary?.batteryBanks?.totalCapacityKWh ?? 1100} kWh Capacity
        </div>
      </div>
    </div>
  )
}