import React from 'react'
import { Sun, Activity, BatteryCharging, ShieldAlert, CheckCircle2, Loader2, Zap, Gauge } from 'lucide-react'
import { useCommunityTelemetryQuery, useHouseholdTelemetryQuery } from '@/hooks/useTelementryQueries'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { useInfrastructureStatsQuery } from '@/hooks/useInfrastructureQueries'
import { useAllHouseholdsQuery, useHouseholdDetailQuery } from '@/hooks/useHouseholdQueries'

interface AnalyticsKpiRowProps {
  scope: 'community' | 'household'
  selectedHouseholdId?: string
}

export const AnalyticsKpiRow: React.FC<AnalyticsKpiRowProps> = ({ scope, selectedHouseholdId }) => {
  const { data: user } = useCurrentUserQuery()
  const { data: communityTelemetry, isLoading: isCommunityLoading } = useCommunityTelemetryQuery()
  const { data: infrastructure } = useInfrastructureStatsQuery()
  const { data: allHouseholds } = useAllHouseholdsQuery()
  const { data: detailedHousehold } = useHouseholdDetailQuery(
    scope === 'household' ? (selectedHouseholdId || '') : ''
  )
  const { data: householdLogs } = useHouseholdTelemetryQuery(
    scope === 'household' ? selectedHouseholdId : undefined
  )

  const householdList = user?.role === 'Admin' ? (allHouseholds || []) : (user?.households || [])
  const fallbackHousehold = householdList.find((hh) => hh._id === selectedHouseholdId) || householdList[0]
  const activeHousehold = detailedHousehold || fallbackHousehold
  const latestHouseholdLog = householdLogs?.[0]

  // Community metrics
  const liveSolarKW = Math.round((communityTelemetry?.summary?.liveSolarGeneratedKW ?? communityTelemetry?.summary?.solarGeneratedKW ?? 0) * 100) / 100
  const estateConsumedKWh = Math.round(
    (allHouseholds || []).reduce((sum, hh) => sum + (hh.consumedKWh || 0), 0) * 100
  ) / 100
  const liveEstateLoadKW = Math.round((communityTelemetry?.summary?.livePowerConsumedKW ?? 0) * 100) / 100

  // Household metrics
  const homeConsumedKWh = Math.round((activeHousehold?.consumedKWh ?? 0) * 100) / 100
  const homeLiveLoadKW = Math.round((latestHouseholdLog?.powerConsumedKW ?? 0) * 100) / 100
  const dailyQuotaKWh = activeHousehold?.dailyKWHQuota || 20
  const quotaRemainingKWh = Math.max(0, Math.round((dailyQuotaKWh - homeConsumedKWh) * 100) / 100)
  const quotaHeadroomPercent = Math.min(100, Math.round((quotaRemainingKWh / dailyQuotaKWh) * 100))

  if (isCommunityLoading) {
    return (
      <div className="flex h-32 items-center justify-center bg-secondary rounded-3xl border border-emerald-800/50">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Generation (Community) vs Live Power Draw (Household) */}
      <div className="bg-secondary p-5 rounded-3xl border border-emerald-800/50 shadow-md">
        <div className="flex justify-between items-center text-xs font-medium text-emerald-300 mb-2">
          <span>{scope === 'community' ? 'Central Solar Output' : 'Live Power Draw'}</span>
          {scope === 'community' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Zap className="h-4 w-4 text-amber-400" />
          )}
        </div>
        <div className="text-2xl font-bold text-accent font-mono">
          {scope === 'community' ? liveSolarKW : homeLiveLoadKW}{' '}
          <span className="text-sm font-normal text-emerald-200">kW</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 mt-2 font-medium">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>
            {scope === 'community'
              ? `${infrastructure?.summary?.solarArrays?.count ?? 0} Central Arrays Active`
              : `Assigned Phase: ${activeHousehold?.phaseConnection || 'Phase 1'}`}
          </span>
        </div>
      </div>

      {/* 2. Energy Consumed */}
      <div className="bg-secondary p-5 rounded-3xl border border-emerald-800/50 shadow-md">
        <div className="flex justify-between items-center text-xs font-medium text-emerald-300 mb-2">
          <span>{scope === 'community' ? 'Estate Energy Usage' : 'Home Energy Usage'}</span>
          <Activity className="h-4 w-4 text-blue-400" />
        </div>
        <div className="text-2xl font-bold text-accent font-mono">
          {scope === 'community' ? estateConsumedKWh : homeConsumedKWh}{' '}
          <span className="text-sm font-normal text-emerald-200">kWh</span>
        </div>
        <div className="text-xs text-emerald-200/80 mt-2">
          {scope === 'community' ? (
            <>Live Estate Load: <strong className="text-accent font-mono">{liveEstateLoadKW} kW</strong></>
          ) : (
            <>Daily Quota: <strong className="text-accent font-mono">{dailyQuotaKWh} kWh</strong></>
          )}
        </div>
      </div>

      {/* 3. Grid Compliance (Community) vs Quota Monitor (Household) */}
      <div className="bg-secondary p-5 rounded-3xl border border-emerald-800/50 shadow-md">
        <div className="flex justify-between items-center text-xs font-medium text-emerald-300 mb-2">
          <span>{scope === 'community' ? 'Active Grid Connections' : 'Quota Monitor'}</span>
          <ShieldAlert className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold text-accent font-mono">
          {scope === 'community'
            ? `${Math.floor(((communityTelemetry?.activeHouseholds ?? 0) / (allHouseholds?.length || 1)) * 100)}%`
            : `${quotaHeadroomPercent}% Left`}
        </div>
        <div className="text-xs text-emerald-200/80 mt-2 font-medium">
          {scope === 'community' ? (
            <span>{communityTelemetry?.activeHouseholds ?? 0} of {allHouseholds?.length ?? 0} Households Active</span>
          ) : activeHousehold?.connectionStatus === 'Suspended' ? (
            <span className="text-red-400 font-semibold">Meter Suspended (Quota Reached)</span>
          ) : (
            <span>{quotaRemainingKWh} kWh Remaining Today</span>
          )}
        </div>
      </div>

      {/* 4. Battery Storage (Community) vs Meter Voltage (Household) */}
      <div className="bg-secondary p-5 rounded-3xl border border-emerald-800/50 shadow-md">
        <div className="flex justify-between items-center text-xs font-medium text-emerald-300 mb-2">
          <span>{scope === 'community' ? 'Battery Storage' : 'Meter Line Voltage'}</span>
          {scope === 'community' ? (
            <BatteryCharging className="h-4 w-4 text-emerald-400" />
          ) : (
            <Gauge className="h-4 w-4 text-emerald-400" />
          )}
        </div>
        <div className="text-2xl font-bold text-accent font-mono">
          {scope === 'community' ? (
            <>{communityTelemetry?.summary?.liveBatteryPercent ?? 0} <span className="text-sm font-normal text-emerald-200">%</span></>
          ) : (
            <>{latestHouseholdLog?.gridVoltage ?? 230} <span className="text-sm font-normal text-emerald-200">V</span></>
          )}
        </div>
        <div className="text-xs text-emerald-400 mt-2 font-medium">
          {scope === 'community'
            ? `${infrastructure?.summary?.batteryBanks?.totalCapacityKWh ?? 1100} kWh Bank Capacity`
            : `Status: ${activeHousehold?.connectionStatus ?? 'Active'}`}
        </div>
      </div>
    </div>
  )
}