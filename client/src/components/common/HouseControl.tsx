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
    <div className="rounded-2xl border bg-accent mt-5 p-5 shadow-sm gap-5">
      <div>
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Button size="icon" variant="outline" aria-label="Power" className="bg-secondary text-accent translate-y-3">
              <PowerIcon size={20} />
            </Button>
            <small className="font-medium text-primary uppercase">Whole-home control: {household?.meterSerialNumber}</small>
          </div>
          <p className="text-sm text-secondary pl-11 -translate-y-2">
            {on} of {total} terminals are on
          </p>
          <Button onClick={() => toggleAll(toggle, householdId, payload, terminals, toggleTerinal)}>
            <div className="flex items-center gap-2">
              <PowerIcon size={16} />
              {anyOn ? "Turn all off" : "Turn all on"}
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-3 justify-between gap-5 ">
          {
            terminals.map(( terminal ) => {

                payload.terminalNumber = terminals.indexOf(terminal) + 1
                payload.connectionStatus = terminal?.connectionStatus

                return (
                    <div key={terminals.indexOf(terminal)} className="bg-green-50 p-5 rounded-2xl">
                        <div>
                            <h3>{terminal?.name || `Terminal ${terminals.indexOf(terminal) + 1}`}</h3>
                            <p className="text-sm text-secondary pl-11 -translate-y-2">Current Usage: {terminal?.consumedKWh} KWH</p>
                            <p className="text-sm text-secondary pl-11 -translate-y-2">Status: {terminal?.connectionStatus}</p>
                        </div>
                        <Button onClick={() => toggleTerinal({householdId, payload })}>
                            { terminal?.connectionStatus ? 'Turn Off' : 'Turn On' }
                        </Button>
                    </div>
                )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default HouseControl