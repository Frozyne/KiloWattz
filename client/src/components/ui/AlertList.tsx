import AllPage from "@/DashBoard/All/page"
import { Button } from "./button"
import { ArrowDownToLineIcon, PlusIcon, ArrowDownIcon, CheckIcon, Stars, BellDotIcon } from "lucide-react"
export default function AlertList(){
  const stats = [
    { label: "Open alerts", value: 12, icon: BellDotIcon},
    { label: "Investigating", value: 5, icon: Stars},
    { label: "Resolved today", value: 28, icon: CheckIcon},
    { label: "Critical", value: 2, icon: ArrowDownIcon},
  ]
  return(
    <section className="ml-2 bg-white p-4 rounded-2xl">
      <header className="font-bold text-3xl">
        Alerts
      </header>
      <div className="flex items-center justify-between">
        <span className="font-extralight text-sm">Investigate, assign, and resolve fleet events.</span>
        <div>
          <Button className="bg-white text-teal-700 font-bold text-sm h-10 w-30 -translate-x-1 border-gray-400"><ArrowDownToLineIcon/>Export log</Button>
          <Button className="bg-teal-700 text-white font-bold h-10"><PlusIcon/>Create work order</Button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4 border-white">
          {stats.map(({ label, value, icon: Icon}) => (
            <div
            key={label}
            className="flex items-center justify-between gap-1 min-w-0 border-white rounded-2xl p-3">
              <div className="flex items-center gap-1 min-w-0">
                <Icon className="h-10 w-10 shrink-0 p-2 rounded-lg border border-teal-700 bg-teal-100 text-teal-700"/>
                <span className="text-sm text-gray-400 truncate">{label}</span>
                </div>
                <p className="text-xl font-bold text-black">{value}</p>
                </div>
          ))}
         </div>
            <p className="-translate-y-2 ml-2">
          <AllPage/>
          </p>
    </section>
  )
}
