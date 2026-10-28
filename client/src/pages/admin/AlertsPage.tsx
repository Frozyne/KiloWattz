import { Button } from "@/components/ui/button"
import { ArrowScroll } from "@/components/layout/ArrowScroll"
import { useState } from "react"
import { SearchIcon } from "lucide-react"


const cols = "grid grid-cols-[100px_2.2fr_1.5fr_1.2fr_90px_140px] items-center gap-4 px-3"
const PAGE_SIZE = 4
const FILTERS = ["All", "Open", "Investigating", "Resolved"] as const
type Filter = (typeof FILTERS)[number]

const alerts = [
  { id: "ALT-1048", name: "Bloom Desert", device: "Inverter 04 · Block B", event: "Voltage fluctuation", date: "Today, 10:42", severity: "High", status: "Open", initials: "BD" },
  { id: "ALT-1047", name: "North Ridge", device: "Weather station", event: "Sensor offline", date: "Today, 09:18", severity: "Medium", status: "Investigating", initials: "NR" },
  { id: "ALT-1046", name: "Sunset Vailey", device: "Array 12 · String 13", event: "Low string output", date: "Today, 08:54", severity: "Medium", status: "Investigating", initials: "SV" },
  { id: "ALT-1045", name: "Mesa Solar One", device: "Gateway 01", event: "Connection restored", date: "Yesterday, 18:21", severity: "Resolved", status: "Resolved", initials: "MS" },
  { id: "ALT-1044", name: "Lakeview Solar", device: "Inverter 08", event: "Temperature warning", date: "Yesterday, 16:06", severity: "Low", status: "Investigating", initials: "LS" },
  { id: "ALT-1043", name: "Canyon Peak", device: "Tracker roe 06", event: "Tracker deviation", date: "Jun 22, 14:30", severity: "Resolved", status: "Resolved", initials: "CP" },
]

export default function AlertPage() {
  const [page, setPage] = useState(0)
  const [filter, setFilter] = useState<Filter>("All")

  const filtered = filter === "All" ? alerts : alerts.filter((a) => a.status === filter)

  const start = page * PAGE_SIZE
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const end = start + visible.length

  const changeFilter = (f: Filter) => {
    setFilter(f)
    setPage(0)
  }
  return (
    <div className="mt-7 border-t">
      <div className="border-gray-400 h-10 p-1 rounded-xl mt-2 mb-90">
        <div className="flex justify-between">
          <form className="flex h-8 item-start">
            <SearchIcon className="h-8 w-4 shrink-0 translate-x-52 font-extralight text-gray-500" />
            <input type="text" name="Enter code" placeholder="Search alerts...."
              className="border rounded-lg outline-none" />
          </form>
          <div className="border-gray-400">
            <Button className="bg-white text-black border-gray-300" onClick={() => changeFilter("All")}>All</Button>

            <Button className="bg-white text-black" onClick={() => changeFilter("Open")}><small>Open</small></Button>

            <Button className="bg-white text-black" onClick={() => changeFilter("Investigating")}><small>Investigating</small></Button>

            <Button className="bg-white text-black" onClick={() => changeFilter("Resolved")}><small>Resolved</small></Button>
          </div>
        </div>
        <ArrowScroll>
          <div className="min-w-[760] whitespace-nowrap border-t p-1">
            <div className={`${cols} text-gray-500`}>
              <small>Alert ID</small>
              <small>Site / Device</small>
              <small>Event</small>
              <small>Detected</small>
              <small>Severity</small>
              <small>Status</small>
            </div>

            {visible.length === 0 && (
              <div className="border-t py-6 text-center text-gray-500">
                <small>No {filter.toLowerCase()} alerts</small></div>
            )

            }
            {visible.map((a) => (
              <div key={a.id} className={`${cols} border-t py-3`}>
                <small>{a.id}</small>

                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border bg-orange-100 text-xs text-gray-500">
                    {a.initials}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <small className="font-semibold">{a.name}</small>
                    <small className="font-extralight text-gray-500">{a.device}</small>
                  </div>
                </div>

                <small>{a.event}</small>
                <small>{a.date}</small>
                <small>{a.severity}</small>

                <span className="w-fit rounded-xl border bg-orange-100 px-2 py-1 text-orange-300">
                  <small>⏺ {a.status}</small>
                </span>
              </div>
            ))}
          </div>
        </ArrowScroll>
        <div className="flex items-center justify-between border p-2 rounded-2xl">
          <small>Showing {filtered.length === 0 ? 0 : start + 1}-{end} of {filtered.length} alerts</small>
          <div className="flex gap-2">
            <Button variant="outline" className="text-gray-500"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" className="text-gray-500" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  )
}