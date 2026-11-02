import { ArrowDownToLineIcon, ArrowUpIcon, ShapesIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";


export default function Devices() {
    const [query, setQuery] = useState("")
    const [region, setRegion] = useState("All")
    return (
        <div className="border p-2 ml-2 rounded-2xl mt-2">
            <span className="text-3xl ml-2 text-primary">Devices</span>
            <div className="flex items-center justify-between">
                <div className="text-primary text-sm ml-2">Monitor inverters, meters, sensors, and tracker controllers.</div>
                <Button className="bg-white text-primary border-gray-200"><ArrowDownToLineIcon />Export devices</Button>
            </div>

            <div className="bg-primary border rounded-lg text-white mt-3 p-5 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <span className="border bg-green-100 text-green-300 p-3 rounded-lg">
                        <ShapesIcon />
                    </span>
                    <div>
                        <small className="text-green-300">Total devices</small>
                        <p className="text-2xl font-bold">1,284</p>
                        <p className="flex items-center gap-1 text-xs text-green-200">
                            <ArrowUpIcon size={10} className="-translate-x-1" />
                            <span className="-translate-x-1">24</span>
                            <span className="text-green-200 -translate-x-1">added this quarter</span>
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <span className="text-sm text-green-300">Online now</span>
                    <strong className="text-2xl">98.2%</strong>
                    <small className="text-sm text-green-200">1,261 reporting normally</small>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-sm text-green-300">Current output</span>
                    <strong className="text-2xl">52.8 MW</strong>
                    <p className="flex items-center gap-1 text-xs text-green-200">
                        <ArrowUpIcon size={10} />
                        <span>8.4%</span>
                        <span className="text-green-200">above forecast</span>
                    </p>
                </div>
            </div>
            <div className="mt-4 border rounded-lg bg-white p-3">
                <div className="relative w-full max-w-sm ml-2 flex justify-between">
                    <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value)
                        }}
                        placeholder="Search devices..."
                        className="rounded-md border py-2 pl-9 pr-3 text-sm outline-none focus:ring-gray-200 text-primary"
                    />
                    <div className="translate-x-40">
                        <select value={region}
                            onChange={(e) => { setRegion(e.target.value); }}
                            className="rounded-md border border-gary-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-200 text-primary">
                            <option value="All">All device types</option>
                            <option value="North">North</option>
                            <option value="South">South</option>
                            <option value="East">East</option>
                            <option value="West">West</option>
                        </select>
                    </div>
                </div>
                <div className="mt-5 border-t">

                    <div className="flex items-center mt-2">
                        <div className="flex items-center gap-3 flex-2">
                            <span className="border rounded-3xl p-2 bg-blue-100 text-primary translate-y-3">S4</span>
                            <small className="font-bold text-sm text-primary -translate-x-2">Sungrow SG35OHX</small>
                        </div>
                        <small className="flex-1 text-primary">Efficiency</small>
                        <small className="flex-1 text-primary">Live reading</small>
                        <small className="flex-1 text-primary">Status</small>
                    </div>
                    <div className="flex items-center -translate-y-2">
                        <small className="flex-2 translate-x-10 text-primary">INV-DB-004. Desert Bloom</small>
                        <small className="flex-1 font-semibold text-primary">99%</small>
                        <small className="flex-1 font-semibold text-primary">2.84 MW</small>
                        <small className="flex-1 font-semibold text-primary">Online</small>
                    </div>
                </div>
                <div className="mt-5 border-t">

                    <div className="flex items-center mt-2">
                        <div className="flex items-center gap-3 flex-2">
                            <span className="border rounded-3xl p-2 bg-mist-700 text-gray-200 translate-y-3">SC</span>
                            <small className="font-bold text-sm text-primary -translate-x-2">SMA Sunny Central</small>
                        </div>
                        <small className="flex-1 text-primary">Efficiency</small>
                        <small className="flex-1 text-primary">Live reading</small>
                        <small className="flex-1 text-primary">Status</small>
                    </div>
                    <div className="flex items-center -translate-y-2">
                        <small className="flex-2 translate-x-10 text-primary">INV-NR-002. North Ridge</small>
                        <small className="flex-1 font-semibold text-primary">98%</small>
                        <small className="flex-1 font-semibold text-primary">1.92 MW</small>
                        <small className="flex-1 font-semibold text-primary">Online</small>
                    </div>
                </div>
                <div className="mt-5 border-t">

                    <div className="flex items-center mt-2">
                        <div className="flex items-center gap-3 flex-2">
                            <span className="border rounded-3xl p-2 bg-blue-100 text-gray-400 translate-y-3">WS</span>
                            <small className="font-bold text-sm text-primary -translate-x-2">Array weather station</small>
                        </div>
                        <small className="flex-1 text-primary">Efficiency</small>
                        <small className="flex-1 text-primary">Live reading</small>
                        <small className="flex-1 text-primary">Status</small>
                    </div>
                    <div className="flex items-center -translate-y-2">
                        <small className="flex-2 translate-x-11 text-primary">WTH-SV-001. Sunset Vailey</small>
                        <small className="flex-1 font-semibold text-primary">92%</small>
                        <small className="flex-1 font-semibold text-primary">824 W/m<sup>2</sup></small>
                        <small className="flex-1 font-semibold text-primary">Warning</small>
                    </div>
                </div>
                <div className="mt-5 border-t">

                    <div className="flex items-center mt-2">
                        <div className="flex items-center gap-3 flex-2">
                            <span className="border rounded-3xl p-2 bg-orange-200 text-gray-400 translate-y-3">H6</span>
                            <small className="font-bold text-sm text-primary -translate-x-2">Huawei SUN2000</small>
                        </div>
                        <small className="flex-1 text-primary">Efficiency</small>
                        <small className="flex-1 text-primary">Live reading</small>
                        <small className="flex-1 text-primary">Status</small>
                    </div>
                    <div className="flex items-center -translate-y-2">
                        <small className="flex-2 translate-x-10 text-primary">INV-MS-006. Mesa Solar One</small>
                        <small className="flex-1 font-semibold text-primary">99%</small>
                        <small className="flex-1 font-semibold text-primary">928 kW</small>
                        <small className="flex-1 font-semibold text-primary">Online</small>
                    </div>
                </div>
                <div className="mt-5 border-t">

                    <div className="flex items-center mt-2">
                        <div className="flex items-center gap-3 flex-2">
                            <span className="border rounded-3xl p-2 bg-orange-200 text-gray-400 translate-y-3">NX</span>
                            <small className="font-bold text-sm text-primary -translate-x-2">Nextraker controller</small>
                        </div>
                        <small className="flex-1 text-primary">Efficiency</small>
                        <small className="flex-1 text-primary">Live reading</small>
                        <small className="flex-1 text-primary">Status</small>
                    </div>
                    <div className="flex items-center -translate-y-2">
                        <small className="flex-2 translate-x-9 text-primary">TRK-LS-0018. Lakeview Solar</small>
                        <small className="flex-1 font-semibold text-primary">0%</small>
                        <small className="flex-1 font-semibold text-primary">0 kW</small>
                        <small className="flex-1 font-semibold text-primary">Online</small>
                    </div>
                </div>
            </div>
        </div>
    )
}
