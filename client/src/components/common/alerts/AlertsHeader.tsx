import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShieldAlert, Power, AlertTriangle, Loader2, X } from 'lucide-react'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'
import {
  useTriggerELSMutation,
  useResolveELSMutation,
} from '@/hooks/useGridMonitoringQueries'

interface AlertsHeaderProps {
  hasActiveEmergency: boolean
}

export const AlertsHeader: React.FC<AlertsHeaderProps> = ({ hasActiveEmergency }) => {
  const { data: user } = useCurrentUserQuery()
  const isAdmin = user?.role === 'Admin'

  const [showSosConfirm, setShowSosConfirm] = useState(false)
  const [sosReason, setSosReason] = useState('')

  const triggerSos = useTriggerELSMutation()
  const resolveSos = useResolveELSMutation()

  const handleTriggerSos = async (e: React.SubmitEvent) => {
    e.preventDefault()
    await triggerSos.mutateAsync({reason: sosReason.trim() || undefined})
    setSosReason('')
    setShowSosConfirm(false)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-primary/20 rounded-2xl p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">
            System Alerts & Grid Logs
          </h1>
          <p className="text-xs sm:text-sm text-primary/75 mt-0.5">
            {isAdmin
              ? 'Monitor community-wide alerts, household quota breaches, and grid emergencies.'
              : 'View grid announcements and alerts from your household meter.'}
          </p>
        </div>

        {/* Admin-Only Emergency Load-Shedding Controls */}
        {isAdmin && (
          <div className="flex items-center gap-2 flex-wrap">
            {hasActiveEmergency && (
              <Button
                onClick={() => resolveSos.mutate()}
                disabled={resolveSos.isPending}
                className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs gap-1.5 rounded-xl"
              >
                {resolveSos.isPending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Power className="size-3.5" />
                )}
                Restore Grid (Resolve SOS)
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => setShowSosConfirm((prev) => !prev)}
              className="border-red-300 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold gap-1.5 rounded-xl"
            >
              <ShieldAlert className="size-3.5 text-red-600" />
              Emergency Load-Shedding
            </Button>
          </div>
        )}
      </div>

      {/* Confirmation Drawer for Emergency SOS */}
      {isAdmin && showSosConfirm && (
        <form
          onSubmit={handleTriggerSos}
          className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"
        >
          <div className="flex items-start gap-2.5 text-red-800">
            <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-bold">Confirm Grid-Wide Load-Shedding</p>
              <p className="text-red-700/90">
                This will immediately suspend all active household connections and broadcast an Emergency alert.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              value={sosReason}
              onChange={(e) => setSosReason(e.target.value)}
              placeholder="Reason (optional)..."
              className="h-9 px-3 text-xs rounded-xl border border-red-300 bg-white text-zinc-900 outline-none focus:border-red-500 min-w-[200px]"
            />
            <Button
              type="submit"
              disabled={triggerSos.isPending}
              className="h-9 bg-red-600 hover:bg-red-700 text-white text-xs rounded-xl"
            >
              {triggerSos.isPending ? 'Initiating...' : 'Confirm Shutdown'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowSosConfirm(false)}
              className="h-9 px-2 text-red-700 hover:bg-red-100 rounded-xl"
            >
              <X className="size-4" />
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}