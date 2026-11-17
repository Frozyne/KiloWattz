import React from 'react'
import { Layers, Loader2, Home, Zap } from 'lucide-react'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { useAllHouseholdsQuery, useHouseholdDetailQuery } from '@/hooks/useHouseholdQueries'

interface PhaseDistributionCardProps {
  scope: 'community' | 'household'
  selectedHouseholdId?: string
}

export const PhaseDistributionCard: React.FC<PhaseDistributionCardProps> = ({
  scope,
  selectedHouseholdId,
}) => {
  const { data: user } = useCurrentUserQuery()
  const { data: allHouseholds, isLoading } = useAllHouseholdsQuery()
  const { data: detailedHousehold } = useHouseholdDetailQuery(
    scope === 'household' ? (selectedHouseholdId || '') : ''
  )

  const householdList = user?.role === 'Admin' ? (allHouseholds || []) : (user?.households || [])
  const fallbackHousehold = householdList.find((hh) => hh._id === selectedHouseholdId) || householdList[0]
  const activeHousehold = detailedHousehold || fallbackHousehold

  let phase1TotalKWh = 0
  let phase2TotalKWh = 0
  let phase3TotalKWh = 0

  if (allHouseholds && allHouseholds.length > 0) {
    allHouseholds.forEach((hh, index) => {
      const draw = hh.consumedKWh || 0
      const phase = hh.phaseConnection

      if (phase === 'Phase 1') {
        phase1TotalKWh += draw
      } else if (phase === 'Phase 2') {
        phase2TotalKWh += draw
      } else if (phase === 'Phase 3') {
        phase3TotalKWh += draw
      } else {
        const plotNum = Number.parseInt(hh.plotNumber, 10)
        const fallbackPhase = !Number.isNaN(plotNum) ? plotNum % 3 : index % 3
        if (fallbackPhase === 0) phase1TotalKWh += draw
        else if (fallbackPhase === 1) phase2TotalKWh += draw
        else phase3TotalKWh += draw
      }
    })
  }

  const grandTotalKWh = phase1TotalKWh + phase2TotalKWh + phase3TotalKWh
  const p1KWh = Math.round(phase1TotalKWh * 10) / 10
  const p2KWh = Math.round(phase2TotalKWh * 10) / 10
  const p3KWh = Math.round(phase3TotalKWh * 10) / 10

  const p1Pct = grandTotalKWh > 0 ? Math.round((phase1TotalKWh / grandTotalKWh) * 100) : 33
  const p2Pct = grandTotalKWh > 0 ? Math.round((phase2TotalKWh / grandTotalKWh) * 100) : 33
  const p3Pct = grandTotalKWh > 0 ? Math.max(0, 100 - p1Pct - p2Pct) : 34

  if (isLoading && scope === 'community') {
    return (
      <div className="flex h-64 items-center justify-center bg-secondary rounded-3xl border border-emerald-800/50">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md">
      <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60 mb-4">
        <h3 className="font-semibold text-accent flex items-center gap-2">
          {scope === 'community' ? (
            <><Layers className="h-5 w-5 text-blue-400" /> 3-Phase Grid Balance</>
          ) : (
            <><Home className="h-5 w-5 text-emerald-400" /> Terminals (Plot {activeHousehold?.plotNumber || 'N/A'})</>
          )}
        </h3>
        {scope === 'household' && (
          <span className="text-xs font-mono text-emerald-300 flex items-center gap-1">
            <Zap className="size-3 text-amber-400" /> {activeHousehold?.phaseConnection || 'Phase 1'}
          </span>
        )}
      </div>

      {scope === 'community' ? (
        <div className="space-y-4">
          {[
            { label: 'Phase 1', kwh: p1KWh, pct: p1Pct, color: 'bg-amber-400' },
            { label: 'Phase 2', kwh: p2KWh, pct: p2Pct, color: 'bg-amber-500' },
            { label: 'Phase 3', kwh: p3KWh, pct: p3Pct, color: 'bg-amber-600' },
          ].map((phase) => (
            <div key={phase.label}>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-emerald-200/80">{phase.label}</span>
                <span className="font-mono text-accent">{phase.kwh} kWh ({phase.pct}%)</span>
              </div>
              <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`${phase.color} h-2.5 rounded-full transition-all duration-500`}
                  style={{ width: `${phase.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 text-xs">
          {activeHousehold?.meter ? (
            ['terminal1', 'terminal2', 'terminal3', 'terminal4', 'terminal5', 'terminal6'].map((tKey, i) => {
              const term = (activeHousehold.meter as any)[tKey]
              const isOn = term?.connectionStatus === 'On'
              return (
                <div key={tKey} className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-emerald-300/80 font-medium">
                    <span className="truncate">{term?.name || `Terminal ${i + 1}`}</span>
                    <span className={`h-2 w-2 shrink-0 rounded-full ${isOn ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  </div>
                  <div className="font-mono text-accent font-semibold text-sm mt-1">
                    {term?.consumedKWh ?? 0} <span className="text-[10px] font-normal text-emerald-300">kWh</span>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="col-span-2 text-xs text-emerald-300/60 italic text-center py-4">
              No active meter terminals mapped.
            </p>
          )}
        </div>
      )}
    </div>
  )
}