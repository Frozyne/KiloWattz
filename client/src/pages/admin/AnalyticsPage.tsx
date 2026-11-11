import React, { useState, useEffect } from 'react'
import { AnalyticsHeader } from '@/components/common/AnalyticsHeader'
import { AnalyticsKpiRow } from '@/components/common/AnalyticsKPIRow'
import { TelemetryChartCard } from '@/components/common/TelemetryChartCard'
import { EnvironmentalYieldCard } from '@/components/common/EnvironmentYieldCard'
import { PhaseDistributionCard } from '@/components/common/PhaseDistributionCard'
import { GridStabilityCard } from '@/components/common/GridStabilityCard'
import { TelemetryPreviewCard } from '@/components/common/TelementryPreviewCard'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { useAllHouseholdsQuery } from '@/hooks/useHouseholdQueries'

export default function AnalyticsPage(): React.JSX.Element {
  const { data: user } = useCurrentUserQuery()
  const { data: allHouseholds } = useAllHouseholdsQuery()
  const isAdmin = user?.role === 'Admin'

  const [scope, setScope] = useState<'community' | 'household'>('community')
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string | undefined>()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Initialize selectedHouseholdId when data resolves
  useEffect(() => {
    if (!selectedHouseholdId) {
      const list = isAdmin ? allHouseholds : user?.households
      if (list && list.length > 0) {
        setSelectedHouseholdId(list[0]._id)
      }
    }
  }, [user, allHouseholds, isAdmin, selectedHouseholdId])

  // Force non-admins to household scope
  useEffect(() => {
    if (user && !isAdmin) {
      setScope('household')
    }
  }, [user, isAdmin])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 600)
  }

  return (
    <div className="min-h-screen p-4 md:p-8 text-accent font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
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
          <GridStabilityCard />
        </div>
      </div>
    </div>
  )
}