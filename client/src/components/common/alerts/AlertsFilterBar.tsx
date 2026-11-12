import React from 'react'
import { Button } from '@/components/ui/button'
import { SearchIcon } from 'lucide-react'
import type { AlertSeverity, AlertScope } from '@/lib/types'

export type StatusFilter = 'Open' | 'Resolved'

interface AlertsFilterBarProps {
  search: string
  onSearchChange: (val: string) => void
  statusFilter: StatusFilter
  onStatusChange: (status: StatusFilter) => void
  severityFilter: AlertSeverity
  onSeverityChange: (severity: AlertSeverity) => void
  scopeFilter: AlertScope
  onScopeChange: (scope: AlertScope) => void
}

const STATUS_TABS: StatusFilter[] = ['Open', 'Resolved']
const SEVERITIES: (AlertSeverity )[] = [ 'Info', 'Warning', 'Critical', 'Emergency']
const SCOPES: (AlertScope)[] = [ 'System', 'Household', 'Infrastructure']

export const AlertsFilterBar: React.FC<AlertsFilterBarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
  scopeFilter,
  onScopeChange,
}) => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white border border-primary/20 p-3 rounded-2xl">
      {/* Search Input */}
      <div className="relative w-full lg:w-72">
        <SearchIcon className="size-4 text-primary/60 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search title, message, plot..."
          className="w-full h-9 pl-9 pr-3 text-xs border border-primary/25 rounded-xl outline-none text-primary placeholder:text-primary/50 focus:border-primary bg-white"
        />
      </div>

      {/* Filters Group */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Severity Select */}
        <select
          value={severityFilter}
          onChange={(e) => onSeverityChange(e.target.value as AlertSeverity)}
          aria-label="Filter by severity"
          className="h-9 px-2.5 text-xs rounded-xl border border-primary/25 bg-white text-primary font-medium outline-none focus:border-primary"
        >
          {SEVERITIES.map((sev) => (
            <option key={sev} value={sev}>
              {sev}
            </option>
          ))}
        </select>

        {/* Scope Select */}
        <select
          value={scopeFilter}
          onChange={(e) => onScopeChange(e.target.value as AlertScope)}
          aria-label="Filter by scope"
          className="h-9 px-2.5 text-xs rounded-xl border border-primary/25 bg-white text-primary font-medium outline-none focus:border-primary"
        >
          {SCOPES.map((sc) => (
            <option key={sc} value={sc}>
              {sc}
            </option>
          ))}
        </select>

        {/* Status Toggle Buttons */}
        <div className="flex items-center gap-1 bg-primary/5 p-1 rounded-xl border border-primary/15">
          {STATUS_TABS.map((tab) => {
            const active = statusFilter === tab
            return (
              <Button
                key={tab}
                type="button"
                size="sm"
                variant={active ? 'default' : 'ghost'}
                onClick={() => onStatusChange(tab)}
                className={`h-7 px-3 text-xs rounded-lg transition-all ${
                  active
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-primary hover:bg-primary/10'
                }`}
              >
                {tab}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}