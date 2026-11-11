import React, { useState, useEffect } from 'react'
import { 
  Home, 
  MapPin, 
  Gauge, 
  Activity, 
  Zap, 
  IdCard, 
  Pencil, 
  Check, 
  X, 
  Loader2 
} from 'lucide-react'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import { useHouseholdDetailQuery, useUpdateHouseholdMutation } from '@/hooks/useHouseholdQueries'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface HouseholdInfoProps {
  householdId?: string
}

export const HouseholdInfo: React.FC<HouseholdInfoProps> = ({ householdId }) => {
  const { data: currentUser } = useCurrentUserQuery()
  const { data: household, isLoading } = useHouseholdDetailQuery(householdId || '')
  const updateHouseholdMutation = useUpdateHouseholdMutation()

  const isAdmin = currentUser?.role === 'Admin'
  const [isEditing, setIsEditing] = useState(false)

  // Draft state includes meterSerialNumber & phaseConnection
  const [draft, setDraft] = useState({
    street: '',
    plotNumber: '',
    meterSerialNumber: '',
    phaseConnection: 'Phase 1' as 'Phase 1' | 'Phase 2' | 'Phase 3',
    connectionStatus: 'Active' as 'Active' | 'Suspended' | 'Disconnected',
    dailyKWHQuota: 20,
  })

  // Sync form state when query resolves
  useEffect(() => {
    if (household) {
      setDraft({
        street: household.street || '',
        plotNumber: household.plotNumber || '',
        meterSerialNumber: household.meterSerialNumber || '',
        phaseConnection: household.phaseConnection || 'Phase 1',
        connectionStatus: household.connectionStatus || 'Active',
        dailyKWHQuota: household.dailyKWHQuota || 20,
      })
    }
  }, [household])

  if (!householdId) {
    return (
      <div className="border rounded-xl p-6 text-center text-slate-400 bg-slate-50/50">
        <Home className="mx-auto size-8 mb-2 opacity-40" />
        <p className="text-sm">Select a household to view details</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="border rounded-xl p-8 flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  const handleSave = async () => {
    if (!householdId) return
    
    // Fixed: Pass 'id' matching mutation expected key
    await updateHouseholdMutation.mutateAsync({
      id: householdId,
      payload: draft,
    })
    setIsEditing(false)
  }

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Home className="size-5 text-emerald-600" />
          <span>Household Details</span>
        </div>

        {isAdmin && (
          !isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 text-xs font-semibold"
            >
              <Pencil className="size-3.5" /> Edit Household
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setIsEditing(false)}
                variant="ghost"
                size="sm"
                className="flex items-center gap-1 text-xs"
              >
                <X className="size-3.5" /> Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={updateHouseholdMutation.isPending}
                size="sm"
                className="flex items-center gap-1 bg-emerald-700 text-white hover:bg-emerald-800 text-xs"
              >
                {updateHouseholdMutation.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Check className="size-3.5" />
                )}
                Save
              </Button>
            </div>
          )
        )}
      </div>

      {/* Address & Connection Status */}
      <div className="space-y-1 border-b pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <MapPin className="size-4 text-slate-400" /> Address
          </div>
          {isEditing ? (
            <Select
              value={draft.connectionStatus}
              onValueChange={(val: 'Active' | 'Suspended' | 'Disconnected' | null) => {
                if (val) setDraft((prev) => ({ ...prev, connectionStatus: val }))
              }}
            >
              <SelectTrigger className="h-7 text-xs w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Disconnected">Disconnected</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                household?.connectionStatus === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              {household?.connectionStatus ?? 'Active'}
            </span>
          )}
        </div>
        {isEditing ? (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              type="text"
              placeholder="Plot Number"
              value={draft.plotNumber}
              onChange={(e) => setDraft({ ...draft, plotNumber: e.target.value })}
              className="rounded border px-2 py-1 text-sm font-medium"
            />
            <input
              type="text"
              placeholder="Street Address"
              value={draft.street}
              onChange={(e) => setDraft({ ...draft, street: e.target.value })}
              className="rounded border px-2 py-1 text-sm font-medium"
            />
          </div>
        ) : (
          <p className="text-base font-medium text-slate-800">
            Plot {household?.plotNumber}, {household?.street}
          </p>
        )}
      </div>

      {/* Editable Meter Number */}
      <div className="space-y-1 border-b pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Gauge className="size-4 text-slate-400" /> Meter Serial Number
        </div>
        {isEditing ? (
          <input
            type="text"
            value={draft.meterSerialNumber}
            onChange={(e) => setDraft({ ...draft, meterSerialNumber: e.target.value })}
            className="w-full rounded border px-2 py-1 text-sm font-mono"
            placeholder="Enter Meter Serial Number"
          />
        ) : (
          <p className="text-base font-mono font-medium text-slate-800">
            {household?.meterSerialNumber || 'N/A'}
          </p>
        )}
      </div>

      {/* Consumed Energy (Read-only) */}
      <div className="space-y-1 border-b pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Activity className="size-4 text-slate-400" /> Consumed Energy
        </div>
        <p className="text-base font-mono font-medium text-slate-800">
          {household?.consumedKWh ?? 0} kWh
        </p>
      </div>

      {/* Quota */}
      <div className="space-y-1 border-b pb-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Zap className="size-4 text-slate-400" /> Daily Quota
        </div>
        {isEditing ? (
          <input
            type="number"
            value={draft.dailyKWHQuota}
            onChange={(e) => setDraft({ ...draft, dailyKWHQuota: Number(e.target.value) })}
            className="rounded border px-2 py-1 text-sm w-32 font-mono"
          />
        ) : (
          <p className="text-base font-mono font-medium text-slate-800">
            {household?.dailyKWHQuota ?? 0} kWh
          </p>
        )}
      </div>

      {/* Editable Phase Connection */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <IdCard className="size-4 text-slate-400" /> Connection Type
        </div>
        {isEditing ? (
          <Select
            value={draft.phaseConnection}
            onValueChange={(val: 'Phase 1' | 'Phase 2' | 'Phase 3' | null) => {
              if (val) setDraft((prev) => ({ ...prev, phaseConnection: val }))
            }}
          >
            <SelectTrigger className="h-8 text-xs w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Single Phase">Single Phase</SelectItem>
              <SelectItem value="Three Phase">Three Phase</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <p className="text-base font-medium text-slate-800">
            {household?.phaseConnection || 'Single Phase'}
          </p>
        )}
      </div>
    </div>
  )
}