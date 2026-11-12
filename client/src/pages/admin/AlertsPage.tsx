import { useState, useMemo } from 'react'
import type { AlertSeverity, AlertScope } from '@/lib/types'
import { useAlertsQuery } from '@/hooks/useGridMonitoringQueries'
import { AlertsHeader } from '@/components/common/alerts/AlertsHeader'
import { AlertsFilterBar, type StatusFilter } from '@/components/common/alerts/AlertsFilterBar'
import { AlertsTable } from '@/components/common/alerts/AlertsTable'
import { AlertsPagination } from '@/components/common/alerts/AlertsPagination'

const PAGE_SIZE = 8

export default function AlertsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Open')
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity>('Info')
  const [scopeFilter, setScopeFilter] = useState<AlertScope>('System')

  // Map UI filter state to getAlerts controller query params
  const { data, isLoading } = useAlertsQuery({
    page: page,
    limit: PAGE_SIZE,
    severity: severityFilter,
    scope: scopeFilter,
    isResolved:
      statusFilter === 'Resolved'
        ? true
        : false,
  })

  const alerts = data?.alerts ?? []
  const pagination = data?.pagination ?? {
    totalAlerts: 0,
    currentPage: page,
    totalPages: 1,
  }

  // Client-side search across current page fields
  const visibleAlerts = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return alerts
    return alerts.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        a._id.toLowerCase().includes(q) ||
        a.household?.plotNumber?.toLowerCase().includes(q) ||
        a.household?.street?.toLowerCase().includes(q)
    )
  }, [alerts, search])

  // Detect if an unresolved Emergency load-shedding alert is active
  const hasActiveEmergency = useMemo(
    () => alerts.some((a) => a.severity === 'Emergency' && !a.isResolved),
    [alerts]
  )

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status)
    setPage(1)
  }

  const handleSeverityChange = (severity: AlertSeverity) => {
    setSeverityFilter(severity)
    setPage(1)
  }

  const handleScopeChange = (scope: AlertScope) => {
    setScopeFilter(scope)
    setPage(1)
  }

  return (
    <div className="mt-6 space-y-4">
      <AlertsHeader hasActiveEmergency={hasActiveEmergency} />

      <AlertsFilterBar
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        severityFilter={severityFilter}
        onSeverityChange={handleSeverityChange}
        scopeFilter={scopeFilter}
        onScopeChange={handleScopeChange}
      />

      <AlertsTable
        alerts={visibleAlerts}
        isLoading={isLoading}
        emptyLabel={ `No ${statusFilter.toLowerCase()} alerts found.` }
      />

      <AlertsPagination
        currentPage={pagination.currentPage}
        totalPages={Math.max(1, pagination.totalPages)}
        totalAlerts={pagination.totalAlerts}
        pageSize={PAGE_SIZE}
        visibleCount={visibleAlerts.length}
        onPageChange={setPage}
      />
    </div>
  )
}