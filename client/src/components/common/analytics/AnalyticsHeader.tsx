import React from 'react'
import { Zap, RefreshCw, Shield, Home } from 'lucide-react'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { useAllHouseholdsQuery } from '@/hooks/useHouseholdQueries'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AnalyticsHeaderProps {
  scope: 'community' | 'household'
  setScope: (scope: 'community' | 'household') => void
  selectedHouseholdId?: string
  onSelectHousehold: (id: string) => void
  onRefresh: () => void
  isRefreshing: boolean
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  scope,
  setScope,
  selectedHouseholdId,
  onSelectHousehold,
  onRefresh,
  isRefreshing,
}) => {
  const { data: user } = useCurrentUserQuery()
  const { data: allHouseholds } = useAllHouseholdsQuery()
  const isAdmin = user?.role === 'Admin'

  // Admins pick from all community meters; Residents pick from their assigned meters
  const availableHouseholds = isAdmin ? (allHouseholds || []) : (user?.households || [])

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-accent flex items-center gap-2">
          <Zap className="h-6 w-6 text-emerald-400" />
          {isAdmin && scope === 'community' ? 'Grid Analytics' : 'Household Analytics'}
        </h1>
        <p className="text-sm text-emerald-100/80 mt-1">
          {isAdmin && scope === 'community'
            ? 'Real-time telemetry, 24-hour central generation curves, and grid health diagnostics.'
            : 'Personal energy consumption, daily quota compliance, and terminal load tracking.'}
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Admin-Only Scope Toggle */}
        {isAdmin ? (
          <div className="flex bg-emerald-950/60 p-1 rounded-xl border border-emerald-800/60 text-xs font-medium">
            <button
              onClick={() => setScope('community')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                scope === 'community'
                  ? 'bg-emerald-800 text-accent font-semibold shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Shield className="h-3.5 w-3.5 text-emerald-400" /> Community
            </button>
            <button
              onClick={() => setScope('household')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                scope === 'household'
                  ? 'bg-emerald-800 text-accent font-semibold shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <Home className="h-3.5 w-3.5 text-emerald-400" /> Household
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/60 text-xs text-emerald-300 font-medium">
            <Home className="h-3.5 w-3.5 text-emerald-400" /> Resident View
          </div>
        )}

        {/* Dynamic Household Dropdown Selector */}
        {scope === 'household' && availableHouseholds.length > 0 && (
          <Select
            value={selectedHouseholdId}
            onValueChange={(val: string | null) => {
              if (val) onSelectHousehold(val)
            }}
          >
            <SelectTrigger className="h-9 w-52 text-xs bg-emerald-950/60 border-emerald-800/60 text-emerald-100 focus:ring-emerald-500 font-medium">
              <SelectValue placeholder="Select Household" />
            </SelectTrigger>
            <SelectContent className="bg-secondary border-emerald-800 text-emerald-100 max-h-60">
              {availableHouseholds.map((hh) => (
                <SelectItem 
                  key={hh._id} 
                  value={hh._id} 
                  className="text-xs hover:bg-emerald-800/50 focus:bg-emerald-800/50 text-emerald-100"
                >
                  Plot {hh.plotNumber}, {hh.street}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Manual Refresh */}
        <button
          onClick={onRefresh}
          className="p-2.5 rounded-xl border border-emerald-800/60 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 hover:text-accent transition-all"
          title="Refresh Telemetry"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>
    </div>
  )
}