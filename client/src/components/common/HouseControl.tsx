import { Button } from '../ui/button'
import { PowerIcon } from 'lucide-react'
import { useHouseholdDetailQuery, useToggleTerminalMutation } from '@/hooks/useHouseholdQueries'
import type { ToggleTerminalPayload } from '@/services/household'
import type { ITerminal, IMeter } from '@/lib/types'

function handleMeter(meter: IMeter): ITerminal[] {
    return [meter.terminal1, meter.terminal2, meter.terminal3, meter.terminal4, meter.terminal5, meter.terminal6]
}

function toggleAll(toggler: 'On' | 'Off', householdId: string, payload: ToggleTerminalPayload, terminals: ITerminal[], toggle: Function) {
        if(toggler) {
        terminals.forEach((terminal) => {
            payload.terminalNumber = terminals.indexOf(terminal) + 1
            payload.connectionStatus = terminal.connectionStatus

            if(terminal.connectionStatus === toggler) {
                toggle({householdId, payload})
            }
        })
    }
}

const HouseControl = ({ id: householdId }: { id: string }) => {
    const {data: household} = useHouseholdDetailQuery(householdId)
    const device = household?.meter
    const { mutateAsync: toggleTerinal} = useToggleTerminalMutation()
    let payload: ToggleTerminalPayload = {terminalNumber: 0, connectionStatus: 'Off'}

    const terminals = handleMeter(device!)

    const total = terminals.length;
    const on = terminals.filter((d) => d.connectionStatus === 'On').length;
    const anyOn = on > 0;
    const toggle = anyOn ? 'On' : 'Off'

  return (
    <div className="mx-5 rounded-2xl border bg-accent mt-2 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Button size="icon" variant="outline" aria-label="Power" className="bg-secondary text-accent translate-y-3">
              <PowerIcon size={20} />
            </Button>
            <small className="font-medium text-primary uppercase">Whole-home control: {household?.meterSerialNumber}</small>
          </div>
          <h2 className="text-2xl font-bold pl-11 -translate-y-3">All Terminals</h2>
          <p className="text-sm text-secondary pl-11 -translate-y-2">
            {on} of {total} terminals are on
          </p>
        </div>

        {
            terminals.map((terminal ) => {

                payload.terminalNumber = terminals.indexOf(terminal) + 1
                payload.connectionStatus = terminal.connectionStatus

                return (
                    <div key={terminals.indexOf(terminal)}>
                        <div>
                            <h3>{terminal.name || `Terminal ${terminals.indexOf(terminal) + 1}`}</h3>
                            <p className="text-sm text-secondary pl-11 -translate-y-2">Current Usage: {terminal.consumedKWh} KWH</p>
                            <p className="text-sm text-secondary pl-11 -translate-y-2">Status: </p>{terminal.connectionStatus}
                        </div>
                        <Button onClick={() => toggleTerinal({householdId, payload })}>
                            { terminal.connectionStatus ? 'Turn Off' : 'Turn On' }
                        </Button>
                    </div>
                )
            })
            
        }

        <Button onClick={() => toggleAll(toggle, householdId, payload, terminals, toggleTerinal)}>
          <div className="flex items-center gap-2">
            <PowerIcon size={16} />
            {anyOn ? "Turn all off" : "Turn all on"}
          </div>
        </Button>
      </div>

      <p className="mt-4 flex items-center gap-2 text-sm text-secondary border-t-2">
        <span className="h-2 w-2 rounded-full bg-green-500" />
        Connected to the Daylight Home Energy Hub
      </p>

      <p className="text-sm text-secondary pl-5"></p>
    </div>
  )
}

export default HouseControl