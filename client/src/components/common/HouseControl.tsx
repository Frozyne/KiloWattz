import { Button } from '../ui/button'
import { PowerIcon, Loader2 } from 'lucide-react'
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

function toggleAll(
  targetStatus: 'On' | 'Off',
  householdId: string,
  terminals: ITerminal[],
  toggle: (args: { householdId: string; payload: ToggleTerminalPayload }) => Promise<unknown>
) {
  terminals.forEach(async (terminal, index) => {
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
  })
}

const HouseControl = ({ id: householdId }: { id: string }) => {
  const { data: household, isLoading } = useHouseholdDetailQuery(householdId)
  const { mutateAsync: toggleTerminal } = useToggleTerminalMutation()

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
    <div className="rounded-2xl border bg-accent mt-5 p-5 shadow-sm gap-5">
      <div>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Button size="icon" variant="outline" aria-label="Power" className="bg-secondary text-accent translate-y-3">
              <PowerIcon size={20} />
            </Button>
            <small className="font-medium text-primary uppercase">
              Whole-home control: {household.meterSerialNumber}
            </small>
          </div>
          <p className="text-sm text-secondary pl-11 -translate-y-2">
            {on} of {total} terminals are on
          </p>
          <Button onClick={() => toggleAll(toggleTarget, householdId, terminals, toggleTerminal)}>
            <div className="flex items-center gap-2">
              <PowerIcon size={16} />
              {anyOn ? 'Turn all off' : 'Turn all on'}
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-3 justify-between gap-5">
          {terminals.map((terminal, index) => {
            const terminalNumber = index + 1
            const isOn = terminal.connectionStatus === 'On'

            return (
              <div key={terminalNumber} className="bg-green-50 p-5 rounded-2xl">
                <div>
                  <h3>{terminal.name || `Terminal ${terminalNumber}`}</h3>
                  <p className="text-sm text-secondary pl-11 -translate-y-2">
                    Current Usage: {terminal.consumedKWh} KWH
                  </p>
                  <p className="text-sm text-secondary pl-11 -translate-y-2">
                    Status: {terminal.connectionStatus}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    toggleTerminal({
                      householdId,
                      payload: {
                        terminalNumber,
                        connectionStatus: isOn ? 'Off' : 'On' ,
                      },
                    })
                  }
                >
                  {isOn ? 'Turn Off' : 'Turn On'}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HouseControl