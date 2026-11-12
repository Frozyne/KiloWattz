import React, { useState } from 'react'
import { ArrowScroll } from '@/components/layout/ArrowScroll'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Home,
  Server,
  Cpu,
  Loader2,
  X,
  Clock,
  UserCheck,
} from 'lucide-react'
import type { IAlert, AlertSeverity } from '@/lib/types'
import { useResolveAlertMutation } from '@/hooks/useGridMonitoringQueries'
import { useCurrentUserQuery } from '@/hooks/useUserQureies'

const cols =
  'grid grid-cols-[95px_1.7fr_2.2fr_1.2fr_105px_160px] items-center gap-4 px-4'

interface AlertsTableProps {
  alerts: IAlert[]
  isLoading: boolean
  emptyLabel: string
}

const severityStyles: Record<AlertSeverity, string> = {
  Info: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  Warning: 'bg-orange-100 text-amber-900 border-orange-200',
  Critical: 'bg-red-100 text-red-800 border-red-200',
  Emergency: 'bg-red-600 text-white border-red-700 font-semibold',
}

export const AlertsTable: React.FC<AlertsTableProps> = ({
  alerts,
  isLoading,
  emptyLabel,
}) => {
  const { data: user } = useCurrentUserQuery()
  const isAdmin = user?.role === 'Admin'
  const resolveMutation = useResolveAlertMutation()

  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null)
  const [resolvingId, setResolvingId] = useState<string | null>(null)

  const handleResolve = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setResolvingId(id)
    try {
      await resolveMutation.mutateAsync(id)
      if (selectedAlert?._id === id) {
        setSelectedAlert((prev) => (prev ? { ...prev, isResolved: true } : null))
      }
    } finally {
      setResolvingId(null)
    }
  }

  const formatDetectedDate = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getScopeDisplay = (alert: IAlert) => {
    if (alert.scope === 'Household' && alert.household) {
      return {
        title: `Plot ${alert.household.plotNumber}`,
        subtitle: alert.household.street,
        icon: <Home className="size-3.5 text-primary" />,
      }
    }
    if (alert.scope === 'Infrastructure') {
      return {
        title: 'Grid Hardware',
        subtitle: 'Infrastructure Node',
        icon: <Cpu className="size-3.5 text-primary" />,
      }
    }
    return {
      title: 'Central Microgrid',
      subtitle: 'System Broadcast',
      icon: <Server className="size-3.5 text-primary" />,
    }
  }

  return (
    <>
      <div className="bg-white border border-primary/20 rounded-2xl overflow-hidden shadow-sm">
        <ArrowScroll>
          <div className="min-w-[820px] whitespace-nowrap">
            {/* Table Header */}
            <div className={`${cols} py-3 bg-primary/5 border-b border-primary/15 text-primary font-semibold`}>
              <small>Alert ID</small>
              <small>Scope / Target</small>
              <small>Event</small>
              <small>Detected</small>
              <small>Severity</small>
              <small>Status</small>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="py-12 flex items-center justify-center text-primary gap-2">
                <Loader2 className="size-5 animate-spin" />
                <small>Loading telemetry alerts...</small>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && alerts.length === 0 && (
              <div className="py-10 text-center text-primary/70">
                <small>{emptyLabel}</small>
              </div>
            )}

            {/* Alert Rows */}
            {!isLoading &&
              alerts.map((alert) => {
                const target = getScopeDisplay(alert)
                const shortId = `ALT-${alert._id.slice(-4).toUpperCase()}`

                return (
                  <div
                    key={alert._id}
                    onClick={() => setSelectedAlert(alert)}
                    className={`${cols} border-t border-primary/10 py-3.5 hover:bg-primary/[0.03] cursor-pointer transition-colors`}
                  >
                    <small className="font-mono font-medium text-primary">
                      {shortId}
                    </small>

                    {/* Scope & Household/System Target */}
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-orange-100/80 text-primary">
                        {target.icon}
                      </span>
                      <div className="flex flex-col leading-tight truncate">
                        <small className="font-semibold text-primary truncate">
                          {target.title}
                        </small>
                        <small className="font-light text-primary/70 truncate">
                          {target.subtitle}
                        </small>
                      </div>
                    </div>

                    {/* Title & Truncated Message */}
                    <div className="flex flex-col leading-tight overflow-hidden pr-2">
                      <small className="font-semibold text-primary truncate">
                        {alert.title}
                      </small>
                      <small className="text-primary/70 truncate">
                        {alert.message}
                      </small>
                    </div>

                    {/* Detected Timestamp */}
                    <small className="text-primary/80 font-mono">
                      {formatDetectedDate(alert.createdAt)}
                    </small>

                    {/* Severity Badge */}
                    <span
                      className={`w-fit rounded-xl border px-2.5 py-0.5 text-[11px] ${severityStyles[alert.severity]}`}
                    >
                      {alert.severity}
                    </span>

                    {/* Status & Admin Resolve Action */}
                    <div className="flex items-center gap-2">
                      {alert.isResolved ? (
                        <span className="w-fit rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
                          <small className="font-medium">⏺ Resolved</small>
                        </span>
                      ) : (
                        <>
                          <span className="w-fit rounded-xl border border-orange-200 bg-orange-100 px-2.5 py-1 text-primary">
                            <small className="font-medium">⏺ Open</small>
                          </span>
                          {isAdmin && (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={resolvingId === alert._id}
                              onClick={(e) => handleResolve(e, alert._id)}
                              className="h-7 px-2 text-[11px] border-primary/30 text-primary hover:bg-primary hover:text-white rounded-lg"
                              title="Mark as resolved"
                            >
                              {resolvingId === alert._id ? (
                                <Loader2 className="size-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="size-3" />
                              )}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
          </div>
        </ArrowScroll>
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div
          onClick={() => setSelectedAlert(null)}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white border border-primary/20 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 text-primary"
          >
            <div className="flex items-start justify-between gap-3 border-b border-primary/10 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-primary/70">
                    ALT-{selectedAlert._id.slice(-4).toUpperCase()}
                  </span>
                  <span
                    className={`rounded-lg border px-2 py-0.5 text-[11px] ${severityStyles[selectedAlert.severity]}`}
                  >
                    {selectedAlert.severity}
                  </span>
                  <span className="rounded-lg border border-primary/20 bg-primary/5 px-2 py-0.5 text-[11px]">
                    {selectedAlert.scope}
                  </span>
                </div>
                <h3 className="text-base font-bold text-primary">
                  {selectedAlert.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg hover:bg-primary/10 text-primary"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="text-sm text-primary/90 leading-relaxed bg-primary/[0.03] p-3.5 rounded-xl border border-primary/10">
              {selectedAlert.message}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-primary/60 flex items-center gap-1">
                  <Clock className="size-3" /> Logged At
                </span>
                <p className="font-mono font-medium">
                  {new Date(selectedAlert.createdAt).toLocaleString()}
                </p>
              </div>

              {selectedAlert.household && (
                <div className="space-y-0.5">
                  <span className="text-primary/60 flex items-center gap-1">
                    <Home className="size-3" /> Affected Household
                  </span>
                  <p className="font-medium">
                    Plot {selectedAlert.household.plotNumber}, {selectedAlert.household.street}
                  </p>
                </div>
              )}

              {selectedAlert.isResolved && selectedAlert.resolvedBy && (
                <div className="col-span-2 space-y-0.5 pt-2 border-t border-primary/10">
                  <span className="text-primary/60 flex items-center gap-1">
                    <UserCheck className="size-3 text-emerald-700" /> Resolved By
                  </span>
                  <p className="font-medium text-emerald-800">
                    {selectedAlert.resolvedBy.fullName} ({selectedAlert.resolvedBy.email})
                    {selectedAlert.resolvedAt &&
                      ` • ${new Date(selectedAlert.resolvedAt).toLocaleString()}`}
                  </p>
                </div>
              )}

              {selectedAlert.metadata && Object.keys(selectedAlert.metadata).length > 0 && (
                <div className="col-span-2 pt-2 border-t border-primary/10">
                  <span className="text-primary/60 block mb-1">Telemetry Metadata</span>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedAlert.metadata).map(([key, val]) => (
                      <span
                        key={key}
                        className="px-2 py-1 rounded-lg bg-orange-100/70 border border-orange-200 font-mono text-[11px]"
                      >
                        {key}: <strong>{String(val)}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-primary/10">
              {isAdmin && !selectedAlert.isResolved && (
                <Button
                  size="sm"
                  disabled={resolvingId === selectedAlert._id}
                  onClick={(e) => handleResolve(e, selectedAlert._id)}
                  className="bg-primary text-white hover:bg-primary/90 text-xs rounded-xl gap-1.5"
                >
                  <CheckCircle2 className="size-3.5" />
                  Mark as Resolved
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedAlert(null)}
                className="text-primary border-primary/25 text-xs rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}