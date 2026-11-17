import React, { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { AnalyticsHeader } from '@/components/common/analytics/AnalyticsHeader'
import { AnalyticsKpiRow } from '@/components/common/analytics/AnalyticsKpiRow'
import { TelemetryChartCard } from '@/components/common/analytics/TelemetryChartCard'
import { EnvironmentalYieldCard } from '@/components/common/analytics/EnvironmentYieldCard'
import { PhaseDistributionCard } from '@/components/common/analytics/PhaseDistributionCard'
import { GridStabilityCard } from '@/components/common/analytics/GridStabilityCard'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { useAllHouseholdsQuery } from '@/hooks/useHouseholdQueries'
import WeatherStats from '@/components/common/WeatherStats'

export default function AnalyticsPage(): React.JSX.Element {
  const queryClient = useQueryClient()
  const { data: user } = useCurrentUserQuery()
  const { data: allHouseholds } = useAllHouseholdsQuery()
  const isAdmin = user?.role === 'Admin'

  const [scope, setScope] = useState<'community' | 'household'>('community')
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | undefined>()
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (!selectedHouseholdId) {
      const list = isAdmin ? allHouseholds : user?.households
      if (list && list.length > 0) {
        setSelectedHouseholdId(list[0]._id)
      }
    }
  }, [user, allHouseholds, isAdmin, selectedHouseholdId])

  useEffect(() => {
    if (user && !isAdmin) {
      setScope('household')
    }
  }, [user, isAdmin])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await queryClient.invalidateQueries()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="min-h-screen text-accent font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <WeatherStats />
        <AnalyticsHeader
          scope={scope}
          setScope={setScope}
          selectedHouseholdId={selectedHouseholdId}
          onSelectHousehold={(id) => setSelectedHouseholdId(id)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        <AnalyticsKpiRow scope={scope} selectedHouseholdId={selectedHouseholdId} />

        <TelemetryChartCard scope={scope} selectedHouseholdId={selectedHouseholdId} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <EnvironmentalYieldCard />
          <PhaseDistributionCard scope={scope} selectedHouseholdId={selectedHouseholdId} />
          <GridStabilityCard scope={scope} selectedHouseholdId={selectedHouseholdId} />
        </div>
      </div>
    </div>
  )
}