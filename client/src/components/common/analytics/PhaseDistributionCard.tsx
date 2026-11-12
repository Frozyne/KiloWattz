import React from 'react'
import { Layers, Loader2, Home, Zap } from 'lucide-react'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { useAllHouseholdsQuery } from '@/hooks/useHouseholdQueries'

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

  const householdList = user?.role === 'Admin' ? (allHouseholds || []) : (user?.households || [])
  const activeHousehold = householdList.find((hh) => hh._id === selectedHouseholdId) || householdList[0]

  // --- COMMUNITY SCOPE: Aggregate usage grouped by connected Phase Port ---
  let phase1TotalKWh = 0
  let phase2TotalKWh = 0
  let phase3TotalKWh = 0

  if (allHouseholds && allHouseholds.length > 0) {
    allHouseholds.forEach((hh, index) => {
      const draw = hh.consumedKWh || 0
      const phase = hh.phaseConnection // 'Phase 1' | 'Phase 2' | 'Phase 3'

      if (phase === 'Phase 1') {
        phase1TotalKWh += draw
      } else if (phase === 'Phase 2') {
        phase2TotalKWh += draw
      } else if (phase === 'Phase 3') {
        phase3TotalKWh += draw
      } else {
        // Fallback grid allocation by plot number if phase is unassigned
        const plotNum = parseInt(hh.plotNumber, 10)
        const fallbackPhase = !isNaN(plotNum) ? plotNum % 3 : index % 3
        if (fallbackPhase === 0) phase1TotalKWh += draw
        else if (fallbackPhase === 1) phase2TotalKWh += draw
        else phase3TotalKWh += draw
      }
    })
  }

  const grandTotalKWh = phase1TotalKWh + phase2TotalKWh + phase3TotalKWh

  const p1KW = Math.round(phase1TotalKWh * 10) / 10
  const p2KW = Math.round(phase2TotalKWh * 10) / 10
  const p3KW = Math.round(phase3TotalKWh * 10) / 10

  const p1Pct = grandTotalKWh > 0 ? Math.round((phase1TotalKWh / grandTotalKWh) * 100) : 33
  const p2Pct = grandTotalKWh > 0 ? Math.round((phase2TotalKWh / grandTotalKWh) * 100) : 33
  const p3Pct = grandTotalKWh > 0 ? Math.max(0, 100 - p1Pct - p2Pct) : 34

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center bg-secondary rounded-3xl border border-emerald-800/50">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="bg-secondary p-6 rounded-3xl border border-emerald-800/50 shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-emerald-800/60 mb-4">
        <h3 className="font-semibold text-accent flex items-center gap-2">
          {scope === 'community' ? (
            <><Layers className="h-5 w-5 text-blue-400" /> 3-Phase Grid Balance</>
          ) : (
            <><Home className="h-5 w-5 text-emerald-400" /> Terminals (Plot {activeHousehold?.plotNumber || 'N/A'})</>
          )}
        </h3>
        <span className="text-xs font-mono text-emerald-300 flex items-center gap-1">
          {scope === 'community' ? (
            ''
          ) : (
            <><Zap className="size-3 text-amber-400 text-sm" /> Connected to {activeHousehold?.phaseConnection || 'Phase 1'}</>
          )}
        </span>
      </div>

      {scope === 'community' ? (
        /* Community Phase Port Distribution */
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-emerald-200/80">Phase 1</span>
              <span className="font-mono text-accent">{p1KW} kWh ({p1Pct}%)</span>
            </div>
            <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-400 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${p1Pct}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-emerald-200/80">Phase 2</span>
              <span className="font-mono text-accent">{p2KW} kWh ({p2Pct}%)</span>
            </div>
            <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${p2Pct}%` }} 
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-emerald-200/80">Phase 3</span>
              <span className="font-mono text-accent">{p3KW} kWh ({p3Pct}%)</span>
            </div>
            <div className="w-full bg-emerald-950/80 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${p3Pct}%` }} 
              />
            </div>
          </div>
        </div>
      ) : (
        /* Household Terminal Breakdown */
        <div className="grid grid-cols-2 gap-3 text-xs">
          {activeHousehold?.meter ? (
            ['terminal1', 'terminal2', 'terminal3', 'terminal4', 'terminal5', 'terminal6'].map((tKey, i) => {
              const term = (activeHousehold.meter as any)[tKey]
              const isOn = term?.connectionStatus === 'On'
              return (
                <div key={tKey} className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-emerald-300/80 font-medium">
                    <span>Terminal {i + 1}</span>
                    <span className={`h-2 w-2 rounded-full ${isOn ? 'bg-emerald-400' : 'bg-red-400'}`} />
                  </div>
                  <div className="font-mono text-accent font-semibold text-sm mt-1">
                    {term?.consumedKWh ?? 0} <span className="text-[10px] font-normal text-emerald-300">kWh</span>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="col-span-2 text-xs text-emerald-300/60 italic text-center py-4">No active meter terminals mapped.</p>
          )}
        </div>
      )}
    </div>
  )
}