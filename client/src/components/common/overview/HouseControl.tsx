import { Button } from '../../ui/button'
import { PowerIcon, Zap, Loader2 } from 'lucide-react'
import { useHouseholdDetailQuery, useToggleTerminalMutation } from '@/hooks/useHouseholdQueries'
import type { ToggleTerminalPayload } from '@/services/household'
import type { ITerminal, IMeter } from '@/lib/types'

function handleMeter(meter?: IMeter | null): ITerminal[] {
  if (!meter) return []
  return [
    meter.terminal1,
    meter.terminal2,
    meter.terminal3,
    meter.terminal4,
    meter.terminal5,
    meter.terminal6,
  ].filter((t): t is ITerminal => Boolean(t))
}

async function toggleAll(
  targetStatus: 'On' | 'Off',
  householdId: string,
  terminals: ITerminal[],
  toggle: (args: { householdId: string; payload: ToggleTerminalPayload }) => Promise<unknown>
) {
  for (let i = 0; i < terminals.length; i++) {
    const terminal = terminals[i]
    if (terminal.connectionStatus !== targetStatus) {
      await toggle({
        householdId,
        payload: {
          terminalNumber: i + 1,
          connectionStatus: targetStatus,
        },
      })
    }
  }
}

const HouseControl = ({ id: householdId }: { id: string }) => {
  const { data: household, isLoading } = useHouseholdDetailQuery(householdId)
  const { mutateAsync: toggleTerminal, isPending } = useToggleTerminalMutation()

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-accent mt-5 p-8 flex justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!household) return null

  const terminals = handleMeter(household.meter)
  const total = terminals.length
  const on = terminals.filter((d) => d.connectionStatus === 'On').length
  const anyOn = on > 0
  const toggleTarget = anyOn ? 'Off' : 'On'

  return (
    <div className="rounded-2xl border bg-accent mt-5 p-5 shadow-sm space-y-5">
      {/* Header & Master Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-secondary/15">
        <div>
          <small className="block font-semibold text-primary uppercase tracking-wider">
            Whole-home control · {household.meterSerialNumber}
          </small>
          <p className="text-sm text-secondary/80 mt-0.5">
            {on} of {total} terminals are on
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          disabled={isPending || total === 0}
          onClick={() => toggleAll(toggleTarget, householdId, terminals, toggleTerminal)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-colors ${
            anyOn
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-secondary hover:bg-secondary/90 text-accent'
          }`}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <PowerIcon className="size-4" />
          )}
          <span>{anyOn ? 'Turn all off' : 'Turn all on'}</span>
        </Button>
      </div>

      {/* 6-Terminal Interactive Tile Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {terminals.map((terminal, index) => {
          const terminalNumber = index + 1
          const isOn = terminal.connectionStatus === 'On'
          const isFault = terminal.connectionStatus === 'Fault'

          return (
            <button
              key={terminalNumber}
              type="button"
              disabled={isPending}
              onClick={() =>
                toggleTerminal({
                  householdId,
                  payload: {
                    terminalNumber,
                    connectionStatus: isOn ? 'Off' : 'On',
                  },
                })
              }
              aria-pressed={isOn}
              className={`flex w-full flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors cursor-pointer disabled:opacity-60 ${
                isOn
                  ? 'bg-secondary text-accent border-secondary'
                  : 'bg-background text-secondary hover:bg-gray-100'
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <Zap className="size-6" strokeWidth={1.5} />
                <span
                  className={`h-2 w-2 rounded-full ${
                    isFault ? 'bg-red-500' : isOn ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                  aria-hidden
                />
              </div>

              <span className="font-medium">
                {terminal.name || `Terminal ${terminalNumber}`}
              </span>

              <small className="opacity-70">
                {isFault
                  ? 'Fault'
                  : isOn
                    ? `On · ${terminal.consumedKW ?? 0} kW`
                    : 'Off'}
              </small>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default HouseControl